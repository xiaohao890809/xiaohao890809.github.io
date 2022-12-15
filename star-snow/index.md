# 星型模型和雪花模型


星型模型和雪花模型的区别以及各自优点。
<!--more-->

## 为什么叫星型模型和雪花模型

- 星型模型：多维表的数据关系，它由**一个事实表和一组维表**组成，每个维作为主键
- 雪花模型：当一个或多个维没有直接连接到事实表上，而是通过**其他维表连接到事实表**的时候，其图解就像雪花模型连接在一起

使用场景：

- 雪花模型使用**维度分析**更加容易，比如“针对特定的广告主，有哪些客户或者公司是在线的?” 
- 星形模型使用**指标分析**更适合，比如“给定的一个客户他们的收入是多少?”

## 各自的优点

星型架构是一种非正规化的结构，多维数据集的每一个维度都直接与事实表相连接，不存在渐变维度，所以数据有一点的**冗余**。

{{<image src="/images/star.png" caption="星型模型" width="600">}}

雪花模型是对星型模型的扩展，它对星型模型的维表进一步层次化，原有的各维表可能被扩展为小的事实表，形成一些局部的“层次”区域，这些被分解的表都连接到主维度表而不是事实表。

{{<image src="/images/snow.png" caption="雪花模型" width="600">}}

- 星型模型因为数据的冗余所以很多统计查询不需要做外部的连接，因此一般情况下效率比雪花模型要高。
- 星型模型不用考虑很多正规化的因素，设计与实现都比较简单。
- 雪花模型由于去除了冗余，有些统计就需要通过表的连接才能产生，所以效率不一定有星型模型高。

## 什么时候使用雪花模型

[Ralph Kimball]^(数据仓库大师)，讲述了三个例子。对于三个例子，使用雪花模型不仅仅是可接受的，而且可能是一个成功设计的关键。

1. 一个用户维度表且数据量较大。其中，80%的事实度量表是匿名访问者，仅包含少数详细信息。**20%的是可靠的注册用户**，且这些注册用户有较为详细的信息，与多个维度表中的数据相连。
1. 例如一个金融产品维度表，且这些金融产品有银行类的，保险类等等区别。因此**不同种类的产品有自己一系列的特殊属性**，且这些属性并非是所有产品共享的。
1. 多个企业共用的日历维度表。但**每个企业的财政周期不同，节假日不同**等等。在数据仓库的环境中用雪花模型，降低储存的空间，到了具体某个主题的数据集市再用星型模型。

## 总结 

通过上面的对比我们可以发现，在数据仓库建设中大多时候比较适合使用星型模型构建底层数据 `Hive` 表，通过大量的冗余来提升查询效率，星型模型对 `OLAP` 的分析引擎支持比较友好，这一点在 `Kylin` 中比较能体现。

而雪花模型在关系型数据库中如 `MySQL`，`Oracle` 中非常常见，尤其像电商的数据库表。在数据仓库中雪花模型的应用场景比较少，但也不是没有，所以在具体设计的时候，可以考虑是不是能结合两者的优点参与设计，以此达到设计的最优化目的。







