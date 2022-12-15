# Hdfs 写数据流程


Hdfs 写数据流程也介绍一下。
<!--more-->

{{<image src="/images/write.png" caption="写流程" width="750">}}

1. 客户端通过 `Distributed FileSystem` 模块向 `NameNode` 请求上传文件，`NameNode` 检查目标文件是否已存在，父目录是否存在。
1. `NameNode` 返回是否可以上传，请求第一个 `Block` 上传到哪几个 `DataNode` 服务器上。
1. `NameNode` 返回 3 个 `DataNode` 节点，分别为 `dn1、dn2、dn3`。
1. 客户端通过 `FSDataOutputStream` 模块请求 `dn1` 上传数据，`dn1` 收到请求会继续调用 `dn2`，然后 `dn2` 调用 `dn3`，将这个通信管道建立完成。
1. `dn1、dn2、dn3` 逐级应答客户端。
1. 客户端开始往 `dn1` 上传第一个 `Block`（先从磁盘读取数据放到一个本地内存缓存），以 `Packet` 为单位，`dn1` 收到一个 `Packet` 就会传给 `dn2`，`dn2` 传给 `dn3`；`dn1` 每传一个 `packet` 会放入一个应答队列等待应答。
1. 当一个 `Block` 传输完成之后，客户端再次请求 `NameNode` 上传第二个 `Block` 的服务器。（重复上面的步骤）。

**参考链接**

- [字节二面：谈谈HDFS读写数据流程](https://mp.weixin.qq.com/s/fKQOsvRYdpSURRQFC9OUXg)
- [HDFS读写流程](https://mp.weixin.qq.com/s/sJ5MrQnwZ-T9L-hBU0Of2Q)
- [腾讯微信部门大数据开发面试题-附答案](https://mp.weixin.qq.com/s/vt_8VKRH7HjEKJ-2P_H1kA)

