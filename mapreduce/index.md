# 图文详解 MapReduce 工作流程


本文会详解 `MapReduce` 工作流程。
<!--more-->

{{<image src="/images/map.png" caption="MR工作流程" width="750">}}

## MapReduce 编程模型

`MapReduce` 编程模型开发简单且功能强大，专门为并行处理大规模数据量而设计，接下来，通过一张图来描述 `MapReduce` 的工作过程，如图所示。

{{<image src="/images/工作流程.png" caption="工作流程" width="700">}}

## 整体流程

在上图中， `MapReduce`5 的工作流程大致可以分为5步，具体如下:

{{<image src="/images/5步.png" caption="5步" width="200">}}

### 分片、格式化数据源

输入 `Map` 阶段的数据源，必须经过**分片和格式化**操作。

- 分片操作：指的是将源文件划分为大小相等的小数据块(Hadoop 2.x 中默认 128MB)，也就是分片(split)，Hadoop 会为每一个分片构建一个 `Map` 任务，并由该任务运行自定义的 map() 函数，从而处理分片里的每一条记录;
- 格式化操作：将划分好的分片(split)格式化为键值对 `<key,value>` 形式的数据，其中，key 代表偏移量，value 代表每一行内容。

### 执行 MapTask

每个 `Map` 任务都有一个[内存缓冲区]^(缓冲区大小100MB)，输入的[分片]^(split)数据经过 Map 任务处理后的中间结果会写入内存缓冲区中。

如果写入的数据达到[内存缓冲的阈值]^(80MB)，会启动一个线程将内存中的溢出数据写入磁盘，同时不影响 Map 中间结果继续写入缓冲区。

在溢写过程中， MapReduce 框架会对 key 进行排序，如果中间结果比较大，会形成多个溢写文件，最后的缓冲区数据也会全部溢写入磁盘形成一个溢写文件，如果是多个溢写文件，则最后合并所有的溢写文件为一个文件。

### 执行 Shuffle 过程
`MapReduce` 工作过程中， `Map` 阶段处理的数据如何传递给 `Reduce` 阶段，这是 `MapReduce` 框架中关键的一个过程，这个过程叫作 `Shuffle`。

`Shuffle` 会将 `MapTask` 输出的处理结果数据分发给 `ReduceTask`，并在分发的过程中，对数据按 `key` 进行**分区和排序**。

### 执行 ReduceTask

输入 `ReduceTask` 的数据流是 `<key, {value list}>` 形式，用户可以自定义 `reduce()` 方法进行逻辑处理，最终以 `<key, value>` 的形式输出。

### 写入文件

`MapReduce` 框架会自动把 `ReduceTask` 生成的 `<key, value>` 传入 `OutputFormat` 的 `write` 方法，实现文件的写入操作。

## MapTask

{{<image src="/images/MapTask.png" caption="MapTask" width="600">}}

1. Read 阶段：`MapTask` 通过用户编写的 `RecordReader`，从输入的 `InputSplit` 中解析出一个个 key / value 。
1. Map 阶段：将解析出的 key / value 交给用户编写的 Map() 函数处理，并产生一系列新的 key / value。
1. Collect 阶段：在用户编写的 map() 函数中，数据处理完成后，一般会调用 outputCollector.collect() 输出结果，在该函数内部，它会将生成的 key / value 分片(通过调用 partitioner)，并写入一个**环形内存缓冲区**中(该缓冲区默认大小是 100MB )。
1. Spill 阶段：即“溢写”，当缓冲区快要溢出时(默认达到缓冲区大小的 80 %)，会在本地文件系统创建一个溢出文件，**将该缓冲区的数据写入这个文件**。

> 将数据写入本地磁盘前，先要对数据进行一次本地排序，并在必要时对数据进行合并、压缩等操作。<br>
写入磁盘之前，线程会根据 ReduceTask 的数量，将数据分区，一个 Reduce 任务对应一个分区的数据。<br>
这样做的目的是为了避免有些 Reduce 任务分配到大量数据，而有些 Reduce 任务分到很少的数据，甚至没有分到数据的尴尬局面。<br>
如果此时设置了 Combiner ，将排序后的结果进行 Combine 操作，这样做的目的是尽可能少地执行数据写入磁盘的操作。

5. Combine 阶段：当所有数据处理完成以后， `MapTask` 会对所有临时文件进行一次合并，以确保最终只会生成一个数据文件

## ReduceTask

{{<image src="/images/ReduceTask.png" caption="ReduceTask" width="700">}}

1. Copy 阶段： Reduce 会从各个 MapTask 上远程复制一片数据（每个 MapTask 传来的数据都是有序的），并针对某一片数据，如果其大小超过一定國值，则写到磁盘上，否则直接放到内存中
1. Merge 阶段：在远程复制数据的同时， ReduceTask 会启动两个后台线程，分别对内存和磁盘上的文件进行合并，以防止内存使用过多或者磁盘文件过多。
1. Sort 阶段：用户编写 reduce() 方法输入数据是按 key 进行聚集的一组数据。

> 为了将 key 相同的数据聚在一起， Hadoop 采用了基于排序的策略。<br>
由于各个 MapTask 已经实现对自己的处理结果进行了局部排序，因此， ReduceTask 只需对所有数据进行一次归并排序即可。

4. Reduce 阶段：对排序后的键值对调用 reduce() 方法，键相等的键值对调用一次 reduce()方法，每次调用会产生零个或者多个键值对，最后把这些输出的键值对写入到 HDFS 中
5. Write 阶段：reduce() 函数将计算结果写到 HDFS 上。

> 合并的过程中会产生许多的中间文件(写入磁盘了)，但 MapReduce 会让写入磁盘的数据尽可能地少，并且最后一次合并的结果并没有写入磁盘，而是直接输入到 Reduce 函数。




