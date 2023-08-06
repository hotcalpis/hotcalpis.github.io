---
title: 見落としがちなバグ
date: '2023-08-05'
description: 実装・レビュー・テストの際に見落としがちな観点
---

※随時追加する予定です

## 全般

### 特定電子メール法

ユーザーの同意なしに広告宣伝メールを送ると法令違反になってしまう。

1. 会員登録画面の「メール配信設定」のデフォルト値を「同意」にしたいがため、DB カラムやリクエストパラメータの初期値を「同意」にした
2. 半年後、Google アカウントで会員登録する機能を追加した
3. 「メール配信設定」が「同意」のユーザーに広告メールを送信した

→ Google アカウントで会員登録したユーザーはオプトインが取れていないのに、広告メールが送られてしまう。

### SQL の条件に NULL が紛れ込む

```ruby
# RailsのActiveRecord
Purchase.where(parent_id: [1, 2, nil])
```

開発環境だとレコード数が少ないので問題ないように見える。
しかし、本番環境にリリースすると大量のレコードがヒットし、メモリ不足でサーバ停止してしまう。

## バッチ

### 処理中の状態変化

1. バッチ処理の対象レコードの id リストを取得

```ruby
reservation_ids = ReservationRepository.list_target`
```

2. 画面操作により予約が削除される

3. メモリ節約のため、1000 件ずつ対象レコードを取得して処理する

```ruby
reservation_ids.each_slice(1000) do |ids|
  reservations_hash = ReservationRepository.hash_by_id(ids)

  ids.each do |id|
    reservation = reservation_hash[id] # nil
    do_something if reservation.is_hoge # エラー
  end
end
```

### LockWaitTimeout

バッチが大量の悲観ロックを取得すると、画面操作などがタイムアウトしてしまう危険性がある。

### 実行時間が長すぎて日を跨ぐ

- 月会費の決済日など、日付が固定されるべきなのに変わってしまう。
- 翌日のバッチ処理にずれ込んで 2 重に処理が走ってしまう。
