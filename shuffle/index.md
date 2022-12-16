# 详解MapReduce Shuffle与Spark Shuffle


本文介绍 `MapReduce Shuffle` 与 `Spark Shuffle` 的详情和区别。
<!--more-->

## Shuffle简介

Shuffle 的本意是洗牌、混洗的意思，把一组有规则的数据尽量打乱成无规则的数据。而在 MapReduce 中，Shuffle 更像是洗牌的逆过程，指的是将 `map` 端的无规则输出按指定的规则“打乱”成具有一定规则的数据，以便 `reduce` 端接收处理。或者说需要将各节点上同一类数据汇集到某一节点进行计算，把这些分布在不同节点的数据按照**一定的规则聚集到一起的过程**称为 Shuffle。

在 Shuffle 之前，也就是在 map 阶段，MapReduce 会对要处理的数据进行[分片]^(split)操作，为每一个分片分配一个 MapTask 任务。接下来 map 会对每一个分片中的每一行数据进行处理得到键值对（key,value），此时得到的键值对又叫做“中间结果”。此后便进入 reduce 阶段，由此可以看出 **Shuffle 阶段的作用是处理“中间结果”**。

由于 `Shuffle` 涉及到了**磁盘的读写**和**网络的传输**，因此 `Shuffle` 性能的高低直接影响到了整个程序的运行效率。

## MapReduce Shuffle

Hadoop 的核心思想是 MapReduce，但 Shuffle 又是 MapReduce 的核心。Shuffle 的主要工作是从 Map 结束到 Reduce 开始之间的过程。Shuffle 阶段又可以分为 **Map 端**的 Shuffle 和 **Reduce 端**的 Shuffle。

## Spark Shuffle

Spark 丰富了任务类型，有些任务之间数据流转不需要通过 Shuffle，但是有些任务之间还是需要通过 Shuffle 来传递数据，比如宽依赖的 group by key 以及各种 by key 算子。**宽依赖之间会划分 stage**，而 Stage 之间就是 Shuffle，如下图中的 stage0，stage1 和 stage3 之间就会产生 Shuffle。

{{<image src="/images/stage.png" caption="stage" width="550">}}

在 Spark 中，负责 shuffle 过程的执行、计算和处理的组件主要就是 [ShuffleManager]^(shuffle管理器)。ShuffleManager 随着 Spark 的发展有两种实现的方式，分别为 HashShuffleManager 和 SortShuffleManager，因此 spark 的 Shuffle 有 `Hash Shuffle` 和 `Sort Shuffle` 两种。

## Spark 与 MapReduce Shuffle 的异同

1. 从整体功能上看，两者并没有大的差别。都是将 mapper（Spark 里是 ShuffleMapTask）的输出进行 partition，不同的 partition 送到不同的 reducer。
1. 从流程的上看，两者差别不小。MapReduce 是 sort-based，进入 combine 和 reduce 的 records 必须**先 sort**。这样的好处在于 combine/reduce 可以处理大规模的数据，因为其输入数据可以通过外排得到（mapper 对每段数据先做排序，reducer 的 shuffle 对排好序的每段数据做归并）。以前 Spark 默认选择的是 hash-based，通常使用 HashMap 来对 shuffle 来的数据进行合并，**不会对数据进行提前排序**。如果用户需要经过排序的数据，那么需要自己调用类似 sortByKey 的操作。
1. 从流程实现角度来看，两者也有不少差别。MapReduce 将处理流程划分出明显的几个阶段：map, spill, merge, shuffle, sort, reduce 等。每个阶段各司其职，可以按照过程式的编程思想来逐一实现每个阶段的功能。在 Spark 中，没有这样功能明确的阶段，只有**不同的 stage** 和一系列的 transformation，所以 spill, merge, aggregate 等操作需要蕴含在 transformation中。
1. 与 MapReduce 完全不一样的是，在 MapReduce 中，map task 必须将所有的数据都写入本地磁盘文件以后，才能启动 reduce 操作，来拉取数据。为什么？因为 mapreduce 要实现默认的根据 key 的排序！所以要排序，肯定得**写完所有数据，才能排序**，然后 reduce 来拉取。<br>
但是 Spark 不需要，spark 默认情况下，是不会对数据进行排序的。因此 ShuffleMapTask 每写入一点数据，ResultTask 就可以拉取一点数据，然后在本地执行我们定义的聚合函数和算子，进行计算。


