# driver 的功能是什么


driver 的功能是什么？
<!--more-->

1. 一个 `Spark` 作业运行时包括一个 `Driver` 进程，也是作业的**主进程**，具有 `main` 函数，并且有 `SparkContext` 的实例，**是程序的人口点**
1. 功能：负责向集群申请资源，向 `master` 注册信息
1. 负责了作业的调度和解析、生成 `Stage` 并调度 `Task` 到 `Executor` 上。包括 `DAGScheduler`，`TaskScheduler`
















