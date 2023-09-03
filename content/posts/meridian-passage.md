---
title: 【Three.js】地球上から見た太陽と月の動き
date: '2021-10-17'
description: Three.js を使って太陽と月の動きを地球上から3Dで見れるようにしました
---

「南中」の挙動がよく分からなかったので、Three.js で直感的に分かるようにしてみました。

1 つめのアニメーションはスクロールすると視点が動きます。
※iOS16 以下だとバグでスクロールできないかもしれません…

<!-- https://bugs.webkit.org/show_bug.cgi?id=248119 -->

夏至の南中高度が 78 度、冬至の南中高度が 31 度でそれぞれ最大と最小になることもバッチリ理解できました。

<br>
<meridian-passage></meridian-passage>
<br>
