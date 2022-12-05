# 大数据之 Reduce Join


介绍 hive 里的 Reduce Join 的一些原理和使用技巧。
<!--more-->
    
## 应用场景

适合于大表 Join 大表

## 原理

{{<image src="/images/大表.png" caption="原理" width="450">}}

- 将两张表的数据在 shuffle 阶段利用 shuffle 的分组来将数据按照关联字段进行合并
- 必须经过 shuffle，利用 Shuffle 过程中的**分组**来实现关联

## 过程

1. Map阶段：构建（key(tag),value）,key 这里后面的数字是 tag，**后面在 reduce 阶段用来区分来自于那个表的数据**，对 key 求 hashcode 设为 hivekey；
1. Shuffle阶段：如果 key 在不同机器上，会通过网络传输把 hivekey 相同的数据汇集到一台机器；
1. Reduce阶段：把 tag=1 的内容（value），都加到 tag=0 的后面，合并输出。

{{<image src="/images/join原理.png" caption="reduce join原理">}}

## 使用

Hive 会自动判断是否满足 Map Join，如果不满足 Map Join，则自动执行 Reduce Join。


