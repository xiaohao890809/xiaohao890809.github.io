# groupby和reduceby的区别


rdd 里面 `groupby` 和 `reduceby` 有什么区别。
<!--more-->
    
reduceByKey 的泛型参数是 `[V]`，而 groupByKey 的泛型参数是 `[CompactBuffer[V]]`。这直接导致了 `reduceByKey` 和 `groupByKey` 的返回值不同，前者是 `RDD[(K, V)]`，而后者是 `RDD[(K, Iterable[V])]`

然后就是 `mapSideCombine=false` 了，这个 mapSideCombine 参数的默认是 true 的。这个值有什么用呢，上面也说了，这个参数的作用是控制要不要在 **map端**进行初步[合并]^(Combine)。可以看看下面具体的例子。

{{<image src="/images/reduce1.png" caption="groupbykey" width="500">}}

{{<image src="/images/reduce2.png" caption="reducebykey" width="500">}}

从功能上来说，可以发现 `ReduceByKey` 其实就是会在每个节点先进行一次合并的操作，而 `groupByKey` 没有。

这么来看 `ReduceByKey` 的性能会比 `groupByKey` 好很多，因为有些工作在节点已经处理了。

- **reduceByKey**：按照 key 进行聚合，在 shuffle 之前有`combine`（预聚合）操作，返回结果是 `RDD[k,v]`。
- **groupByKey**：按照 key 进行分组，直接进行 shuffle。
- 开发指导：reduceByKey 比 groupByKey，建议使用。但是需要注意是否会影响业务逻辑。
