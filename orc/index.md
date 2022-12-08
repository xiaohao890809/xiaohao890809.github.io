# ORC 和 Parquet 文件存储格式


ORC 与 Parquet 的较量。
<!--more-->

## 嵌套结构支持

Parquet 能够很完美的支持嵌套式结构，而在这一点上 ORC 支持的并不好，表达起来复杂且性能和空间都损耗较大。

Parquet 非常适用于 OLAP 场景，按列存储和扫描。

## 更新与 ACID 支持

ORC 格式支持 update 操作与 ACID，而 Parquet 并不支持。

## 压缩与查询性能

在压缩空间与查询性能方面，Parquet 与 ORC 总体上相差不大。可能 ORC 要稍好于 Parquet。

## 查询引擎支持

这方面 Parquet 可能更有优势，支持 Hive、Impala、Presto 等各种查询引擎，而 ORC 与 Hive 接触的比较紧密，而与 Impala 适配的并不好。之前我们说 Impala 不支持 ORC，直到 CDH 6.1.x 版本也就是 Impala3.x 才开始以 experimental feature 支持 ORC 格式。

ORC 文件是可切分（Split）的。因此，在 Hive 中使用 ORC 作为表的文件存储格式，不仅节省 HDFS 存储资源，查询任务的输入数据量减少，使用的 MapTask 也就减少了。

## 总结

关于 Parquet 与 ORC，首先建议根据实际情况进行选择。另外，根据笔者的综合评估，如果不是一定要使用 ORC 的特性，还是建议选择 Parquet。

## 参考链接

- [文件存储格式：ORC 与 Parquet的较量](https://mp.weixin.qq.com/s/V7_JO1p7FIiPDgbb6aWUwA)
- [干货 | 再来聊一聊 Parquet 列式存储格式](https://mp.weixin.qq.com/s/o1TIHfSdtqhAOHEmKB5WgQ)

