# MR中如何控制map的数量


`hadooop` 提供了一个设置 `map` 个数的参数 `mapred.map.tasks`，我们可以通过这个参数来控制 `map` 的个数。但是通过这种方式设置 map 的个数，并不是每次都有效的。原因是 `mapred.map.tasks` 只是一个 `hadoop` 的参考数值，最终 `map` 的个数，还取决于其他的因素。[^1]

为了方便介绍，先来看几个名词：

- `block_size` : hdfs 的文件块大小，默认为 128M，可以通过参数 `hdfs.block.size` 设置
- `total_size` : 输入文件整体的大小
- `input_file_num` : 输入文件的个数

## 默认 map 个数

如果不进行任何设置，默认的 map 个数是和 blcok_size 相关的。

`default_num = total_size / block_size`

## 期望大小

可以通过参数 `mapred.map.tasks` 来设置期望的 `map` 个数，但是这个个数只有在大于 `default_num` 的时候，才会生效。

`goal_num = mapred.map.tasks（默认为2）`

## 设置处理的文件大小

可以通过 `mapred.min.split.size` 设置每个 task 处理的文件大小，但是这个大小只有在大于 block_size 的时候才会生效。

- `split_size = max(mapred.min.split.size, block_size)`
- `split_num = total_size / split_size`

## 计算的map个数

`compute_map_num = min(split_num,  max(default_num, goal_num))`

除了这些配置以外，mapreduce 还要遵循一些原则。 mapreduce 的每一个 `map` 处理的数据是不能跨越文件的，也就是说 `min_map_num >= input_file_num`。 所以，最终的 `map` 个数应该为：

`final_map_num = max(compute_map_num, input_file_num)`

## 总结

经过以上的分析，在设置 `map` 个数的时候，可以简单的总结为以下几点：

1. 如果想增加 `map` 个数，则设置 `mapred.map.tasks` 为一个较大的值。
1. 如果想减小 `map` 个数，则设置 `mapred.min.split.size` 为一个较大的值。
1. 如果输入中有很多小文件，依然想减少 `map` 个数，则需要将小文件 `merger` 为大文件，然后使用准则 2。

[^1]: [MR中如何控制map的数量](https://blog.csdn.net/godlovedaniel/article/details/120180197)



