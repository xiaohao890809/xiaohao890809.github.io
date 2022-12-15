# RDD 和 DataFrame 的区别是什么


`RDD` 和 `DataFrame` 的区别是什么？
<!--more-->

{{<image src="/images/rdd.png" caption="rdd和df" width="450">}}

`RDD` 是 `Spark` 对于分布式数据模型的抽象，`DF` 是带数据模式的结构化分布式数据集，类似于传统数据库中的一张表，`RDD` 不带数据模式或者说是泛型的。

## 使用 RDD 的一般场景

1. 你需要使用 low-level 的转化操作和行动操作来控制你的数据集;
1. 你得数据集非结构化，比如，流媒体或者文本流;
1. 你想使用**函数式编程**来操作你得数据，而不是用特定领域语言( DSL )表达;
1. 你不在乎 schema，比如，当通过名字或者列处理(或访问)数据属性不在意列式存储格式;
1. 你放弃使用 DataFrame 和 DataSet 来优化结构化和半结构化数据集。

## DataFrame 和 RDD 的优缺点

### RDD

**优点**

- 编译时类型安全，开发会进行类型检查，在编译的时候及时发现错误
- 具有面向对象编程的风格

**缺点**

- 构建大量的 `java` 对象占用了大量 `heap` 堆空间，导致频繁的 `GC`
- 数据的序列化和反序列性能开销很大

### DataFrame

DataFrame 引入了 [schema]^(元信息) 和 [off-heap]^(堆外)

1. `DataFrame` 引入 `off-heap`，大量的对象构建直接使用操作系统层面上的内存，不在使用 `heap` 堆中的内存
1. `DataFrame` 引入了 `schema` 元信息(就是数据结构的描述信息)，只需要把数据的内容本身进行序列化就可以，数据结构信息可以省略掉。

**缺点**

- 编译时类型不安全，编译时不会进行类型的检查，无法在编译的时候发现错误，只有在运行的时候才会发现
- 不再具有面向对象编程的风格

**参考链接**

- [Spark之RDD与DataFrame的区别与理解](https://blog.csdn.net/godlovedaniel/article/details/119391493)
- [RDD 和 DataFrame 的区别是什么？](https://blog.csdn.net/Shockang/article/details/118584123)

