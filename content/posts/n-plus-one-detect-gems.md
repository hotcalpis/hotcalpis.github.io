---
title: 'Rails における Bullet 以外の N+1 検知方法'
date: '2024-01-30'
description: 'Rails N+1 Bullet Prosopite'
---

Rails における N+1 の検知方法では Bullet が最も有名だと思います。
しかし、Repository パターンを採用しているプロジェクト等では、ActiveRecord Associations を使用していないため Bullet が導入できません。

そこで、今回は Bullet 以外の選択肢を検討します。

## 先に結論

Bullet が使えない場合は `Prosopite` がオススメです。
`Prosopite` は ActiveRecord でクエリを発行さえしていれば導入できます。

## Gem等の比較

では Gem を比較していきます。

調査の途中で気づいたのですが、どの Gem も意外と単純な仕組みでした。
それぞれ、何をもって N+1 とみなすか、どう検知するかを2行でまとめています。

### Bullet

```
ActiveRecord Associations のプリロードを怠った状態で関連先レコードを呼ぶのがN+1であり、
ActiveRecord のメソッド呼び出しにフック処理を仕込んで検知する。
```

- ❌ **仕組み上、ActiveRecord Associations を使ってないプロジェクトでは無意味です。**
- （実装）`Member.all.to_a.each(&:comments)` を例とする。
  まず、`Member.all.to_a` の実行結果が複数件の場合、このメンバー達の関連先レコードがプリロード可能であることが `Thread.current[:bullet_possible_objects]` にメモされる。
  そして、`member.comments` が呼ばれたタイミングで、プリロード可能にも関わらずプリロードされていないため N+1 としてログに出力される。

### n_plus_one_control

```
レコード数の増減によってクエリの回数も増減するのがN+1であり、
レコード数を変えながらテストコードを実行して検知する。
```

- ❌ **実装コストが高いです。** この Gem が提供しているのはレコードの件数を変えてテストを実行するための utilities なので、それを使ってテストケースを実装していく必要があります。

### 【番外編】自力でループ処理とクエリ実行箇所をトレースする

```
ループの中でクエリを実行しているのが N+1 であり、
Enumerable のループ系メソッドとクエリ実行箇所の caller 情報をスタックして検知する。
```

- ❌ **精度が悪いです。** メモ化されているものやループ回数が高々5回程度のものまで検知してしまいます。

<details>
<summary>クリックで実装イメージを表示</summary>

```ruby
# ※面倒なので検証してないです。あくまでも実装イメージとして残します。
NP1_METHOD_NAMES = [:collect, :each, :filter, :filter_map, :find, :flat_map, :inject, :map, :reduce, :reject, :select]
NP1_ENUMERATORS = [Array, Hash, Range, Enumerator]

NP1_ENUMERATORS.each do |klass|
  NP1_METHOD_NAMES.each do |method_name|
    eval %(#{klass}.class_eval { alias_method :#{method_name}_orig, :#{method_name} })
  end
end

module EnumeratorTraceable
  NP1_METHOD_NAMES.each_orig do |method_name|
    module_eval %(
      def #{method_name}(*args, &block)
        return #{method_name}_orig(*args) unless block_given?

        # TODO: この辺で余計な caller 情報は除外する
        Thread.current[:each_stack].push(caller[0])

        #{method_name}_orig(*args, &block)
      ensure
        Thread.current[:each_stack].pop
      end
    )
  end
end

NP1_ENUMERATORS.each do |klass|
  eval %(#{klass}.class_eval { prepend EnumeratorTraceable })
end

# これでループ処理のスタックトレースが取れるので、あとは `ActiveSupport::Notifications.subscribe('sql.active_record')` などと組み合わせてループ内でクエリ実行されている箇所を検知する。
```

</details>

### Prosopite

```
同じ形・同じバックトレースのクエリが複数回実行されるのがN+1であり、
ActiveSupport::Notifications でクエリの回数をカウントして検知する。
```

- 😄 **QA環境など、それなりにデータ量のある環境で有効にしておけば検知できそうです。**
  - ループ回数の少ない N+1 は修正するメリットがほぼなく、検知してもノイズになるだけなので、基準値（min_n_queries）の設定次第でそれらを除外できるのも嬉しいです。
  - 検証したところオーバーヘッドも小さそうでした。
- （実装）1. `ActiveSupport::Notifications.subscribe 'sql.active_record'` でクエリの実行を検知して、2. コールスタックとSQLの形からクエリの同一性を判定し、3. 各クエリごとに件数をカウントしている。

ということで、`Prosopite` がよさそうです。

## Prosopite の導入

### どのようなN+1を修正すべきか

Prosopite の設定を行うにあたり、そもそもどのような N+1 を検知/修正するのか整理しておきましょう。
明確な基準はないですが、以下の条件に2つ以上当てはまると要修正だと思います。

- 簡単に直せる
- 発生頻度が高い
- 100ms単位の大きな遅延を生み出している（または将来的に生み出す可能性がある）

### 設定

上記の整理を踏まえて、Prosopite の設定を行なっていきます。
設定値は [README](https://github.com/charkost/prosopite?tab=readme-ov-file#configuration) にまとめられています。

`min_n_queries`
検知の対象とするクエリ発行回数の最小値です。遅延の大きいものを優先的に検知したいので、50などある程度大きめの数値にすると良いでしょう。

`backtrace_cleaner`
バックトレースの余計な情報を取り除くためのオプションです。`Rails.root` は削除し、汎用的な処理を除外しておきましょう。

`enabled`
本番環境ではオーバーヘッドを嫌ってOFFにしておいた方がいいかもしれません。（その場合、そもそもGem自体を読み込まないようにするのがベスト）

### カスタマイズと最終コード

最後に1点だけ、Prosopite は検知した N+1 をログに出す仕様になっていて不便なので、Sentry に飛ばすようにします。
これにより、発生頻度が高いものを見分けやすくもなります。

最終的に以下のようなコードになりました。

```ruby
# initializers/prosopite.rb
return unless Rails.env.staging?

module ProsopiteClassPatch
  def send_notifications
    tc[:prosopite_notifications].each do |queries, kaller|
      error = Prosopite::NPlusOneDetected.new(fingerprint(queries.first))
      error.set_backtrace(backtrace_cleaner.clean(kaller))

      Sentry.with_scope do |scope|
        scope.clear_breadcrumbs
        scope.set_tags(app_name: Settings.app_name, n_plus_one_count: queries.length)
        Sentry.capture_exception(error, level: :warning)
      end
    end
  rescue StandardError
    # エラーが起きても処理は継続
  end
end

module Prosopite
  singleton_class.prepend ProsopiteClassPatch
  class NPlusOneDetected < StandardError; end
end

Rails.application.config.after_initialize do
  # TODO: 有効にする条件があるなら設定
  Prosopite.enabled = true

  # TODO: 基準値とホワイトリストを調整
  Prosopite.min_n_queries = 20
  Prosopite.ignore_queries = [/INSERT|UPDATE|DELETE/]
  Prosopite.allow_stack_paths = []

  # TODO: 適切に除外
  bc = ActiveSupport::BacktraceCleaner.new
  bc.add_filter { |line| line.gsub(Rails.root.to_s, '') }
  bc.add_silencer { |line| %r{vendor|arproxy|middlewares}.match?(line) }
  Prosopite.backtrace_cleaner = bc
end

require 'prosopite/middleware/rack'
Rails.configuration.middleware.use(Prosopite::Middleware::Rack)
```

## 最後に

ということで、`Prosopite` を使っていきましょう。
余談ですが、今回の調査は程よくコードを読んだり考えたりできたので面白かったです。
