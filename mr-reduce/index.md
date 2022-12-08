# 如何设置ReduceTask并行度


如果 `ReduceTask` 数量过多，一个 `ReduceTask` 会产生一个结果文件，这样就会生成很多小文件，那么如果这些结果文件会作为下一个 `Job` 的输入，则会出现小文件需要进行合并的问题，而且启动和初始化 `ReduceTask` 需要耗费资源。[^1]

如果 `ReduceTask` 数量过少，这样一个 `ReduceTask` 就需要处理大量的数据，并且还有可能会出现**数据倾斜**的问题，使得整个查询耗时长。默认情况下，`Hive` 分配的 `reducer` 个数由下列参数决定：

`Hadoop MapReduce` 程序中，`ReducerTask` 个数的设定极大影响执行效率，`ReducerTask` 数量与输出文件的数量相关。如果 `ReducerTask` 数太多，会产生大量小文件，对 `HDFS` 造成压力。如果 `ReducerTask` 数太少，每个 `ReducerTask` 要处理很多数据，容易拖慢运行时间或者造成 `OOM`。这使得 `Hive` 怎样决定 `ReducerTask` 个数成为一个关键问题。遗憾的是 `Hive` 的估计机制很弱，不指定 `ReducerTask` 个数的情况下，`Hive` 会猜测确定一个 `ReducerTask` 个数，基于以下两个设定：

```shell
参数1：hive.exec.reducers.bytes.per.reducer (默认256M)
参数2：hive.exec.reducers.max (默认为1009)
参数3：mapreduce.job.reduces (默认值为-1，表示没有设置，那么就按照以上两个参数进行设置)
```

`ReduceTask` 的计算公式为:

$N = Math.min(参数2，总输入数据大小 / 参数1)$

可以通过改变上述两个参数的值来控制 `ReduceTask` 的数量。也可以通过

```shell
set mapred.map.tasks=10;
set mapreduce.job.reduces=10;
```

通常情况下，有必要手动指定 `ReduceTask` 个数。考虑到 `Mapper` 阶段的输出数据量通常会比输入有大幅减少，因此即使不设定 `ReduceTask` 个数，重设**参数2**还是必要的。依据经验，可以将参数2设定为 $M * (0.95 * N)$ (`N` 为集群中 `NodeManager` 个数)。一般来说，`NodeManage` 和 `DataNode` 的个数是一样的。

[^1]: [如何设置ReduceTask并行度](https://blog.csdn.net/godlovedaniel/article/details/120181613)



