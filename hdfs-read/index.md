# Hdfs 读数据流程


那 Hdfs 读数据流程你了解吗？
<!--more-->

{{<image src="/images/read.png" caption="读流程" width="750">}}

1. 客户端通过 `Distributed FileSystem` 向 `NameNode` 请求下载文件，`NameNode` 通过**查询元数据**，找到文件块所在的 `DataNode` 地址。
1. 挑选一台 `DataNode`（就近原则，然后随机）服务器，请求读取数据。
1. `DataNode` 开始传输数据给客户端（从磁盘里面读取数据输入流，以 `Packet` 为单位来做校验）。
1. 客户端以 `Packet` 为单位接收，**先在本地缓存**，然后写入目标文件。


**参考链接**

- [字节二面：谈谈HDFS读写数据流程](https://mp.weixin.qq.com/s/fKQOsvRYdpSURRQFC9OUXg)
- [HDFS读写流程](https://mp.weixin.qq.com/s/sJ5MrQnwZ-T9L-hBU0Of2Q)
- [腾讯微信部门大数据开发面试题-附答案](https://mp.weixin.qq.com/s/vt_8VKRH7HjEKJ-2P_H1kA)

