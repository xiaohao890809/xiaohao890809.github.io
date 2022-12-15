# HQL 转换为 MR 任务流程


 sql 如何转化为 `MR`，整体流程讲一下。
<!--more-->

{{<image src="/images/hsql.png" caption="hive-sql" width="800">}}

1. 进入程序，利用 `Antlr` 框架定对 `HQL` 完成词法语法解析，将 `HQL`转换为为 [AST]^(抽象语法树)
1. 遍历 `AST`，抽象出查询的基本组成单元 [QueryBlock]^(查询块)
1. 遍历 `QueryBlock`，将其转换为 [OperatorTree]^(操作树)（也就是逻辑执行计划）
1. 使用逻辑优化器对 [OperatorTree]^(操作树) 进行逻辑优化。例如合并不必要的 `ReduceSinkOperator`，**减少 Shuffle 数据量**
1. 遍历 `OperatorTree`，转换为 `TaskTree`。也就是翻译为 `MR` 任务的流程，**将逻辑执行计划转换为物理执行计划**
1. 使用物理优化器对 `TaskTree` 进行物理优化
1. 生成最终的执行计划，提交任务到 `Hadoop` 集群运行

**参考链接**

- [HQL 转换为 MR 任务流程介绍](https://blog.csdn.net/weixin_45417821/article/details/119113489)
- [一个HQL语句是如何转换成MR任务的？](https://blog.csdn.net/godlovedaniel/article/details/119853510)


