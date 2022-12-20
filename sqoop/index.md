# Sqoop or Datax


sqoop 和 datax 作为 2 款优秀的数据同步工具，备受数据开发人员喜爱。
<!--more-->

## sqoop

### 定义

`sqoop` 是 `apache` 旗下一款“Hadoop中的各种存储系统（HDFS、HIVE、HBASE） 和关系数据库（mysql、oracle、sqlserver等）服务器之间传送数据”的工具。

{{<image src="/images/sqoop.png" caption="sqoop" width="550">}}

### 底层工作机制

将导入或导出命令翻译成 `MapReduce` 程序来实现，在翻译出的 `MapReduce` 中主要是对 `InputFormat` 和 `OutputFormat` 进行定制。

## datax

### 简介

DataX 是一个异构数据源离线同步工具，致力于实现包括关系型数据库(MySQL、Oracle等)、HDFS、Hive、ODPS、HBase、FTP等各种异构数据源之间稳定高效的数据同步功能。

{{<image src="/images/DataX.png" caption="DataX" width="550">}}

### 核心架构

{{<image src="/images/核心架构.png" caption="核心架构" width="600">}}

`DataX` 本身作为离线数据同步框架，采用 `Framework + plugin` 架构构建。将数据源读取和写入抽象成为 `Reader/Writer` 插件，纳入到整个同步框架中。

### 核心模块介绍

举例来说，用户提交了一个 `DataX` 作业，并且配置了 `20` 个并发，目的是将一个 `100` 张分表的 `mysql` 数据同步到 `odps` 里面。

DataX 的调度决策思路是：

1. `DataXJob` 根据分库分表切分成了 100 个 `Task`。
1. 根据 20 个并发，`DataX` 计算共需要分配 4 个 `TaskGroup`。
1. 4 个 `TaskGroup` 平分切分好的 100 个Task，每个 `TaskGroup` 负责以 5 个并发共计运行 25 个 `Task`。

## 总结 

对于 `sqoop` 和 `datax`，如果只是单纯的数据同步，其实两者都是 ok 的，但是如果需要集成在大数据平台，还是比较推荐使用 `datax`，原因就是**支持流量控制，支持运行信息收集，及时跟踪数据同步情况**。

















