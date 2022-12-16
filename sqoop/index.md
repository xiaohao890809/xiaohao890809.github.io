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

















