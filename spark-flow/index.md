# Spark 任务执行流程?


Spark 执行流程详解。
<!--more-->

{{<image src="/images/spark.png" caption="spark流程" width="750">}}

1. `SparkContext` 向资源管理器注册并申请运行 `Executor`，资源管理器分配并启动 `Executor`
1. `Executor` 发送心跳至资源管理器，保持通信
1. `SparkContext` 构建 `DAG` 有向无环图，将 `DAG` 分解成 [Stage]^(TaskSet)，把 `Stage` 发送给 `TaskScheduler`
1. `Executor` 向 `SparkContext` 申请 `Task`，`TaskScheduler` 将 `Task` 和应用程序代码发送给 `Executor` 运行
1. `Task` 在 `Executor` 上运行，运行完毕把结果反馈给 `Driver` 端，释放所有资源


**参考链接**

- [Spark执行流程详解](https://blog.csdn.net/qq_42456324/article/details/124499170)
- [腾讯微信部门大数据开发面试题-附答案](https://mp.weixin.qq.com/s/vt_8VKRH7HjEKJ-2P_H1kA)

