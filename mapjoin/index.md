# 大表join小表，独钟爱mapjoin


在 Hive 调优里面，经常会问到一个很小的表和一个大表进行 join，如何优化。
<!--more-->

Shuffle 阶段代价非常昂贵，因为它需要排序和合并。减少 Shuffle 和 Reduce 阶段的代价可以提高任务性能。

MapJoin 通常用于一个**很小的表**和一个**大表**进行 join 的场景，具体小表有多小，由参数 `hive.mapjoin.smalltable.filesize` 来决定，该参数表示小表的总大小，默认值为 25000000 字节，即 25M。

Hive0.7 之前，需要使用 hint 提示 `/*+ mapjoin(table) */` 才会执行 MapJoin,否则执行 Common Join，但在 0.7 版本之后，默认自动会转换 Map Join，由参数 `hive.auto.convert.join` 来控制，默认为true。

假设 a 表为一张大表，b 为小表，并且 `hive.auto.convert.join=true`，那么 Hive 在执行时候会自动转化为 MapJoin。

MapJoin 简单说就是

- 在 Map 阶段将小表数据从 HDFS 上读取到内存中的哈希表中，读完后将内存中的哈希表序列化为哈希表文件
- 在下一阶段，当 MapReduce 任务启动时，会将这个哈希表文件上传到 Hadoop 分布式缓存中，该缓存会将这些文件发送到每个 Mapper 的本地磁盘上。
- 因此，所有 Mapper 都可以将此持久化的哈希表文件加载回内存，并像之前一样进行 Join。
- 顺序扫描大表完成 Join。减少昂贵的 shuffle 操作及 reduce 操作

MapJoin分为两个阶段：

- 通过 MapReduce Local Task，将小表读入内存，生成 HashTableFiles 上传至 Distributed Cache 中，这里会 HashTableFiles 进行压缩。
- MapReduce Job 在 Map 阶段，每个 Mapper 从 Distributed Cache 读取 HashTableFiles 到内存中，顺序扫描大表，在 Map 阶段直接进行 Join，将数据传递给下一个 MapReduce 任务

{{<image src="/images/mapjoin.png" caption="mapjoin" width="550">}}

在 MapReduce 任务中，第一步就是创建一个 MapReduce 本地任务，然后该 map / reduce 任务从 HDFS 读取小表的数据，然后把数据保存到内存中的哈希表，然后再存储到一个哈希表文件。接着，当 MapReduce join 任务启动的时候，它会把哈希表文件移到 Hadoop 分布式内存中，并把哈希表文件存储到每个 mapper 的本地磁盘上。所有的 mapper 都能把这个哈希表文件加载到内存，然后在 map 阶段做 join 操作。[^1]

[^1]: [Hive map Join](https://hadoopdoc.com/hive/hive-map-join)



