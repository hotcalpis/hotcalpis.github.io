---
title: 'RubyのMixinでインポート/エクスポート機能を非同期化する'
date: '2024-05-03'
description: ''
---

## 既存のImportUsecase

既存の実装が以下のようになっていると想定します。

- Usecaseはinvokeメソッドで実行しresultに結果を格納する。
- ImportUsecaseの継承元は多種多様。
- ImportUsecase#initializeの引数は(file, option)まで共通、それ以降はUsecaseごとに異なる。
- ImportUsecaseはresultにインポート結果を格納する。（呼び出し元から参照する）

```rb
class Reservation::Reservations::ImportUsecase < ::ImportUsecase
  # 継承
  # def initialize(file, option)
  #   @file = file
  #   @option = option
  # end

  def import
    result.import_summary = Importer.new(file, option).import
  end
end
```

```rb
class Master::Studios::ImportUsecase < ::BulkImportUsecase
  def initialize(file, option, studio_type:)
    super(file, option)
  end

  def import
    ...
  end
end
```

```rb
class Purchase::PaypalImportUsecase < ::BaseUsecase
  def initialize(file, option, payment_date)
    super(Result.new)
  end

  def import
    ...
  end
end
```

## 実装

上記を踏まえ汎用的なMixinを実装しました。
要点は以下の通りです。

- インポート処理の前後で非同期用の処理を行うようにラップする。具体的には、ファイルアップロード・ダウンロードや進行状況のDB保存など。
- initialize だけ prepend にすることで、エンキュー時に Mixin が追加した引数をデキュー後に Mixin が真っ先に抜き取れる。これにより既存の initialize や継承元をいじらずに済む。

```rb
module ImportUsecaseAsyncable
  attr_reader :args, :option_args, :import_entity

  def self.included(mod)
    mod.prepend(Module.new do
      def initialize(file, option, *args, **option_args)
        @import_entity = option_args.delete(:import_entity)

        super

        @args = args
        @option_args = option_args
      end
    )
  end

  # 何かしらエントリーポイントを用意する
  def invoke_or_enqueue
    async? ? enqueue : invoke
  end

  def enqueue
    validate1
    validate2
    validate3

    @import_entity = ImportEntity.create(status: ImportStatus.INPROGRESS, file_name: file.original_filename, target:)
    S3Client.new.put_object(import_entity.file_key, file)

    invoke_later(nil, option, *args, import_entity:, **option_args)
  end

  def invoke
    return super unless async?

    # エンキューから実行までの時間が経つにつれてロストアップデートのリスクが高まるためn時間でエラーにすることも検討

    @file = S3client.new.get_tempfile(import_entity.file_key)
    super

    import_entity.update(status: ImportStatus.COMPLETED, summary: result.import_summary)
    # ActionCable や Pusher で完了を通知したい場合はここでやる
  rescue StandardError => e
    return raise unless async?

    import_entity.update(status: ImportStatus.FAILED, summary: result.import_summary, error_message: e.message)
    # ActionCable や Pusher で失敗を通知したい場合はここでやる
    raise
  end

  # 今回は option から判定するように実装
  # usecase.async.invoke のように Builder 風にするのもアリ
  def async?
    option.is_async
  end

  def target
    raise NotImplementedError, "#{self.class} has not implemented method '#{__method__}'"
  end
end
```

```rb
class Reservation::Reservations::ImportUsecase < ::ImportUsecase
  include ImportUsecaseAsyncable

  def target
    ImportTarget.RESERVATION
  end

  ...
end
```
