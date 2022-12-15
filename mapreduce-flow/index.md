# Mapreduce 工作原理


介绍一下 `Mapreduce` 工作原理？
<!--more-->

{{<image src="/images/flow.png" caption="工作流程" width="650">}}

MapReduce 工作原理分为以下 5 个步骤

1. 在客户端启动一个作业。
1. 向 `JobTracker` 请求一个 `Job ID`。
1. 将运行作业所需要的`资源文件复制到 HDFS` 上，包括 MapReduce 程序打包的 JAR 文件、配置文件和客户端计算所得的输入划分信息。
1. `JobTracker` 接收到作业后，将其放在一个作业队列里，等待作业调度器对其进行调度，作业调度器会根据输入划分信息为每个划分创建一个 map 任务，并将 map 任务分配给 `TaskTracker` 执行。
1. `TaskTracker` 每隔一段时间会给 `JobTracker` 发送一个**心跳**，告诉 `JobTracker` 它依然在运行，同时心跳中还携带着很多的信息，比如当前 map 任务完成的进度等信息。

以上是在客户端、`JobTracker`、`TaskTracker` 的层次来分析 `MapReduce` 的工作原理。

**参考链接**

- [腾讯微信部门大数据开发面试题-附答案](https://mp.weixin.qq.com/s/vt_8VKRH7HjEKJ-2P_H1kA)

