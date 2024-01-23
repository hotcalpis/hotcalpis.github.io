---
title: '【調査メモ】N+1の速度にインデックスの有無などが影響するか'
date: '2024-01-23'
description: ''
---

※メモ書きです。有益な結果は得られませんでした…

N+1のクエリが実行される際、インデックスの有無やクラスタ率、レコードがヒットするかどうかなどが速度に影響するのか気になったので軽く調べました。

```ruby
(1..10000).to_a.shuffle.each { |i| MemberEntity.create(indexed_column: i, normal_column: i, text: 'a' * 5000) }
```

```ruby
Benchmark.bm do |r|
  r.report do
    (1..10000).each { |i| Member.where(id: i) }
  end
  r.report do
    Member.where(id: (1..10000).to_a)
  end

  r.report do
    (1..10000).each { |i| Member.where(indexed_column: i) }
  end
  r.report do
    Member.where(indexed_column: (1..10000).to_a)
  end

  r.report do
    (1..10000).each { |i| Member.where(normal_column: i) }
  end
  r.report do
    Member.where(normal_columnd: (1..10000).to_a)
  end

  r.report do
    (10001..20000).each { |i| Member.where(id: i) }
  end
  r.report do
    Member.where(id: (10001..20000).to_a)
  end

  r.report do
    (10001..20000).each { |i| Member.where(indexed_column: i) }
  end
  r.report do
    Member.where(indexed_column: (10001..20000).to_a)
  end

  r.report do
    (10001..20000).each { |i| Member.where(normal_column: i) }
  end
  r.report do
    Member.where(normal_column: (10001..20000).to_a)
  end
end
```

```
    user     system      total        real
0.420741   0.000000   0.420741 (  0.425944)
0.005375   0.000000   0.005375 (  0.005454)
0.423805   0.000000   0.423805 (  0.424566)
0.008841   0.000000   0.008841 (  0.009155)
0.443217   0.000000   0.443217 (  0.444134)
0.003450   0.000000   0.003450 (  0.003494)
0.392685   0.000000   0.392685 (  0.393423)
0.003572   0.000000   0.003572 (  0.003578)
0.427924   0.000000   0.427924 (  0.428400)
0.003509   0.000000   0.003509 (  0.003641)
0.426364   0.000000   0.426364 (  0.427024)
0.003675   0.000000   0.003675 (  0.003924)
```

結論としてはどれも変わらず、面白くない結果でした。
バッファヒット率あたりの設定とかによってはまた変わったりするのでしょうか…？

10月にデータベーススペシャリストを受けたおかげでこういった発想ができるようになったのは進歩だと思いますが、
実務で活かすためには知識も感覚も鍛えていかないとダメですね。
