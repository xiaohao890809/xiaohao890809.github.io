# 理解 spark 中的 job、stage、task


一般我们在提交s `park` 任务的时候，都会去其 `UI` 界面查看任务运行状况。其中就有 `job、stage、task` 的一些执行进度展示。今天，就详细说明一下这些名词术语的含义。
<!--more-->

## Job

spark 中的数据都是抽象为 `RDD` 的，它支持两种类型的算子操作：Transformation 和 Action。

Transformation 算子的代码不会真正被执行。只有当我**们的程序里面遇到一个 action 算子的时候，代码才会真正的被执行**。

`Transformation` 算子主要包括：

- map
- mapPartitions
- flatMap
- filter
- union
- groupByKey
- repartition
- cache 等

`Action` 算子主要包括：

- reduce
- collect
- show
- count
- foreach
- saveAsTextFile 等

当在程序中遇到一个 `action` 算子的时候，就会提交一个 `job`，执行前面的一系列操作。因此平时要注意，如果声明了数据需要 `cache` 或者 `persist`，但在 `action` 操作前释放掉的话，该数据实际上并没有被缓存。

通常一个任务会有多个 `job`，`job` 之间是按照串行的方式执行的。一个 `job` 执行完成后，才会起下一个 `job`。

## Stage

一个 `job` 通常包含一个或多个 `stage`。各个 `stage` 之间按照顺序执行。上面已经说过，一个 `job` 会有多个算子操作。这些算子都是将一个父 `RDD` 转换成子 `RDD`。这个过程中，会有两种情况：父 `RDD` 中的数据是否进入不同的子 `RDD`。

- 如果一个父 `RDD` 的数据只进入到一个子 `RDD`，比如 `map、union` 等操作，称之为 [narrow dependency]^(窄依赖)。
- 否则，就会形成 [wide dependency]^(宽依赖)，一般也称为 `shuffle` 依赖，比如 `groupByKey` 等操作。

`job` 中 `stage` 的划分就是根据 `shuffle` 依赖进行的。`shuffle` 依赖是两个 `stage` 的分界点。`shuffle` 操作一般都是任务中最耗时耗资源的部分。因为数据可能存放在 `HDFS` 不同的节点上，下一个 `stage` 的执行首先要去拉取上一个 `stage`的数据（shuffle read操作），保存在自己的节点上，就会增加网络通信和 IO。

## Task

一个 `spark application` 提交后，陆续被分解为 `job、stage`，到这里其实还是一个比较粗的概念。`Stage` 继续往下分解，就是 `Task`。`Task` 应该是 `spark` 最细的执行单元了。`Task` 的数量其实就是 `stage` 的并行度。

`RDD` 在计算的时候，每个分区都会起一个 `task`，**所以 `rdd` 的分区数目决定了总的的 `task` 数目**。每个 `Task` 执行的结果就是生成了目标 `RDD` 的一个 `partiton`。在 `Map` 阶段 `partition` 数目保持不变。在 `Reduce` 阶段，`RDD` 的聚合会触发 `shuffle` 操作，聚合后的 `RDD` 的 `partition` 数目跟具体操作有关，例如 `repartition` 操作会聚合成指定分区数。

**参考链接**

- [理解spark中的job、stage、task](https://blog.csdn.net/a772304419/article/details/117754951)

