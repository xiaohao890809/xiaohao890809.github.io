# Spark 为什么比 MapReduce 快


 Spark 为什么比 MapReduce 快?
<!--more-->

1. `Spark` 是基于内存计算，`MapReduce` 是基于磁盘运算，所以速度快
1. `MapReduce` 在 `Shuffle` 时需要花费大量时间进行排序；`Spark` 在 `Shuffle` 时则只有部分场景才需要排序。
1. MapReduce 的 `Map Task` 和 `Reduce Task` 都是**进程级别**的，每次启动都需要重新申请资源，消耗了不必要的时间；而 `Spark Task` 则是基于**线程**模型的，`Spark` 通过复用线程池中的线程来减少启动、关闭 `task` 所需要的开销。
1. `Spark` 还拥有[容错机制]^(Lineage)

**参考链接**

- [腾讯微信部门大数据开发面试题-附答案](https://mp.weixin.qq.com/s/vt_8VKRH7HjEKJ-2P_H1kA)
- [为什么Spark运行比MapReduce快](https://blog.csdn.net/amazing_cxb/article/details/108174375)
- [Spark速度比MapReduce快，不仅是内存计算](https://mp.weixin.qq.com/s/e8hW244UYiq-4tn0_n463w)
