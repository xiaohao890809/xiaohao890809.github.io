# 数仓之学无止境


本文主要摘抄数仓面试中的一些常见问题，以便后续查阅复习。
<!--more-->

## 数仓是什么？

数据仓库是一个**面向主题**的、**集成**的、**相对稳定**的、**反映历史变化**的数据集合，用于支持管理决策。

## Hive 是什么？

1. 是基于 Hadoop 的一个数据仓库工具；
1. 可以将结构化的数据映射为一张数据库表；
1. 并提供 HQL(Hive SQL) 查询功能；
1. 底层数据是存储在 HDFS 上；
1. Hive 的本质是将 SQL 语句转换为 MapReduce、Tez 或者 spark 等任务执行；
1. 适用于离线的批量数据计算。

## ETL 是哪三个单词的缩写

- `Extraction` 提取
- `Transformation` 转换
- `Loading` 加载

## 知道笛卡尔积吗？

根据笛卡尔积的定义，JOIN 的两表中的任意一行都会形成一组关系对，如果 A 表有 N 条记录，B 表有 M 条记录，A X B 会生产 N*M 条数据。 [^1]

1. 可 以 通 过 `CROSS JOIN` 来实现笛卡尔积 `select * from A cross join b`
1. 如果不支持 `CROSS JOIN` 的情况下，可以采用 `select * from A join B on 1 = 1` 的方式实现。
1. 第二种方法可能在语法检测阶段就报错不支持，可以转成如下语法 `select * from (select * , '1' as flag from A) t1 on (select *, '1' as flag from B) t2 where t1.flag = t2.flag`

## shuffle 用来干什么？

为了让相同的 key 都到一个 reduce 中进行处理，reduce 要去每个 map 中拉取数据，all-to-all 的过程，跨分区聚集相同的 key。 

## 数据倾斜的场景与解决方法

## 内部表和外部表

## 离线数仓最大的挑战是什么，如何克服的，是否沉淀方法论

## 实时数仓如何保障数据质量，有哪些手段和方式

[^1]: 参考链接：[大数据SQL如何实现笛卡尔积](https://blog.csdn.net/firenet1/article/details/125268142)













