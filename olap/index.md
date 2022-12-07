# 技术选型：Kylin、Druid、ClickHouse如何选择？


Kylin、Druid、ClickHouse 是目前主流的 `OLAP` 引擎，本文尝试从数据模型和索引结构两个角度，分析这几个引擎的核心技术，并做简单对比。在阅读本文之前希望能对 Kylin、Druid、ClickHouse 有所理解。
<!--more-->
    
## Kylin

###  Kylin 数据模型

Kylin 的数据模型本质上是将二维表（Hive表）转换为 `Cube`，然后将 `Cube` 存储到 `HBase` 表中，也就是两次转换。

第一次转换，其实就是传统数据库的 `Cube` 化，Cube 由 `CuboId` 组成，下图每个节点都被称为一个 CuboId，CuboId 表示固定列的数据数据集合，比如 "AB" 两个维度组成的 CuboId 的数据集合等价于以下 `SQL` 的数据集合：

```sql
select A, B, sum(M), sum(N) from table group by A, B
```

{{<image src="/images/kylin1.png" caption="kylin" width="400">}}

第二次转换，是将 `Cube中` 的数据存储到 `HBase` 中，转换的时候 `CuboId` 和维度信息序列化到 `rowkey`，度量列组成列簇。在转换的时候数据进行了预聚合。下图展示了 `Cube` 数据在 `HBase` 中的存储方式。

{{<image src="/images/kylin2.png" caption="kylin" width="650">}}

### Kylin索引结构

因为 `Kylin` 将数据存储到 `HBase` 中，所以 `kylin` 的数据索引就是 `HBase` 的索引。`HBase` 的索引是简化版本的 **B+树**，相比于 B+树，`HFile` 没有对数据文件的更新操作。

`HFile` 的索引是按照 `rowkey` 排序的聚簇索引，索引树一般为二层或者三层，索引节点比 `MySQL` 的 B+树大，默认是64KB。数据查找的时候通过树形结构定位到节点，节点内部数据是按照 `rowkey` 有序的，可以通过二分查找快速定位到目标。

{{<image src="/images/kylin3.png" caption="kylin" width="550">}}

### Kylin小结

适用于聚合查询场景；

- 因为数据预聚合，`Kylin` 可以说是最快的查询引擎（`group-by` 查询这样的复杂查询，可能只需要扫描 1 条数据）；
- Kylin 查询效率取决于是否命中 `CuboId`，查询波动较大；
- `HBase` 索引有点类似 `MySQL` 中的联合索引，维度在 `rowkey` 中的排序和查询维度组合对查询效率影响巨大；
- 所以 `Kylin` 建表需要业务专家参与。

## Druid

###  Druid 数据模型

Druid 数据模型比较简单，它将数据进行预聚合，只不过预聚合的方式与 `Kylin` 不同，Kylin 是 `Cube` 化，Druid 的预聚合方式是将所有维度进行 `Group-by`，可以参考下图：

{{<image src="/images/druid1.png" caption="Druid" width="550">}}

### Druid索引结构

Druid 索引结构使用自定义的数据结构，整体上它是一种列式存储结构，每个列独立一个逻辑文件（实际上是一个物理文件，在物理文件内部标记了每个列的start和offset）。对于维度列设计了索引，它的索引以 `Bitmap` 为核心。

下图为 "city" 列的索引结构：

{{<image src="/images/druid2.png" caption="Druid" width="550">}}

首先将该列所有的唯一值排序，并生成一个字典，然后对于每个唯一值生成一个 `Bitmap`，`Bitmap` 的长度为数据集的总行数，每个 `bit` 代表对应的行的数据是否是该值。`Bitmap` 的下标位置和行号是一一对应的，所以可以定位到度量列，`Bitmap` 可以说是反向索引。同时数据结构中保留了字典编码后的所有列值，其为正向的索引。
那么查询如何使用索引呢？以以下查询为例：

```sql
select site, sum(pv) from xx where date = 2020-01-01 and city = 'bj' group by site
```

1. city 列中二分查找 `dictionary`并找到 `'bj'` 对应的 bitmap
1. 遍历 city 列，对于每一个字典值对应的 bitmap 与 `'bj'` 的 bitmap 做与操作
1. 每个相与后的 bitmap 即为 city = `'bj'` 查询条件下的 site 的一个 group 的 pv 的索引
1. 通过索引在 pv 列中查找到相应的行，并做 agg
1. 后续计算

###  Druid小结

Druid 适用于**聚合查询场景但是不适合有超高基维度**的场景；存储全维度 `group-by` 后的数据，相当于只存储了 Kylin Cube 的 Base-CuboID；每个维度都有创建索引，所以每个查询都很快，并且没有类似 Kylin 的巨大的查询效率波动。

## ClickHouse

### Clickhouse 索引结构

此处只讨论 `MergeTree` 引擎。

因为 `Clickhouse` 数据模型就是普通二维表，这里不做介绍，只讨论索引结构。整体上 `Clickhouse` 的索引也是列式索引结构，每个列一个文件。

Clickhouse索引的大致思路是：

1. 首先选取部分列作为索引列，整个数据文件的数据按照索引列有序，这点类似 MySQL 的联合索引
1. 其次将排序后的数据每隔 8194 行选取出一行，记录其索引值和序号，注意这里的序号不是行号，序号是从零开始并递增的，Clickhouse 中序号被称作 `Mark’s number`
1. 然后对于每个列（索引列和非索引列），记录 `Mark’s number` 与对应行的数据的 `offset`。

下图中以一个二维表（date, city, action）为例介绍了整个索引结构，其中（date,city）是索引列。

{{<image src="/images/clk1.png" caption="Clickhouse" width="600">}}

那么查询如何使用索引呢？以以下查询为例：

```sql
select count(distinct action) where date = toDate(2020-01-01) and city = 'bj'
```

1. 二分查找 `primary.idx` 并找到对应的 `mark’s number`集合（即数据 block 集合）
1. 在上一步骤中的 block 中，在 date 和 city 列中查找对应的值的行号集合，并做交集，确认行号集合
1. 将行号转换为 `mark’s number` 和 `offset in block`（注意这里的 offset 以行为单位而不是 byte）
1. 在 `action` 列中，根据 `mark’s number` 和 ``.mark` 文件确认数据 `block` 在 `bin` 文件中的 `offset`，然后根据 `offset in block` 定位到具体的列值。
1. 后续计算

该实例中包含了对于列的正反两个方向的查找过程。

- 反向：查找 date = toDate(2020-01-01) and city = 'bj' 数据的行号；
- 正向：根据行号查找 action 列的值。

对于反向查找，只有在查找条件匹配最左前缀的时候，才能剪枝掉大量数据，其它时候并不高效。

### Clickhouse小结

- `MergeTree Family` 作为主要引擎系列，其中包含适合明细数据的场景和适合聚合数据的场景；
- Clickhouse 的索引有点类似 MySQL 的联合索引，当查询前缀元组能命中的时候效率最高，可是一旦不能命中，几乎会扫描整个表，效率波动巨大；
- 所以建表需要业务专家，这一点跟 Kylin 类似。

## 总结

- Kylin、Druid 只适合聚合场景，ClickHouse 适合明细和聚合场景
- 聚合场景，查询效率排序：Kylin > Druid > ClickHouse
- Kylin、ClickHouse 建表都需要业务专家参与
- Kylin、ClickHouse 查询效率都可能产生巨大差异
- ClickHouse 在向量化方面做得的最好，Druid 少量算子支持向量化、Kylin 目前还不支持向量化计算




