# order by,sort by,distribute by,cluster by的区别


深入探究 order by,sort by,distribute by,cluster by 的区别，并用数据征服你。
<!--more-->
    
## 准备工作

### 建表

```sql
drop table if exists wedw_dw.province_city_info;
create table wedw_dw.province_city_info(
 proinve_name string        COMMENT '省份名'
,city_name    string        COMMENT '市名'
,pc_cnt       bigint        COMMENT '人口数(单位：万)'
,in_come      decimal(16,2) COMMENT '收入(单位：亿)'
)
row format delimited fields terminated by ',';
```

### 数据准备

{{<image src="/images/数据准备.png" caption="数据准备" width="450">}}

## order by

- 升序: asc  
- 降序: desc  
- 默认升序

order by 会对输入做全局排序，因此只有一个 reducer(多个 reducer 无法保证全局有序)，然而只有一个 Reducer 会导致当输入规模较大时，消耗较长的计算时间。

```sql
select 
    *
from wedw_dw.province_city_info 
order by in_come desc;
```

{{<image src="/images/orderby.png" caption="order by" width="450">}}

## sort by

sort by 不是全局排序，其在数据进入 reducer 前完成排序，因此，如果用 sort by 进行排序并且设置 mapped.reduce.tasks > 1，则 sort by 只会保证每个 reducer的输出有序，并不保证全局有序。(全排序实现:先用 sortby 保证每个 reducer 输出有序，然后在进行 order by 归并下前面所有的 reducer 输出进行单个 reducer排序，实现全局有序。)

在 `sort by` 之前我们还有配置属性:

```shell
//配置ruduce数量
set mapreduce.job.reduces=4;
```

```sql
select 
    * 
from wedw_dw.province_city_info 
sort by in_come desc;
```

{{<image src="/images/sortby.png" caption="sort by" width="450">}}

## distribute by

distribute by 是控制在 map 端如何拆分数据给 reduce 端的。hive 会根据 distribute by 后面列，对应 reduce 的个数进行分发，默认是采用 `hash` 算法。

sort by 为每个 reduce 产生一个排序文件。在有些情况下，你需要控制某个特定行应该到哪个 reducer，这通常是为了进行后续的聚集操作。

distribute by 刚好可以做这件事。因此，distribute by 经常和 sort by 配合使用。

- distribute by 的分区规则是根据分区字段的 hash 码与 reduce 的个数进行模除后，余数相同的分到一个区。[^1]
- Hive 要求 DISTRIBUTE BY 语句要写在 SORT BY 语句之前。

```sql
select 
    * 
from wedw_dw.province_city_info 
distribute by proinve_name;
```

{{<image src="/images/分发.png" caption="distribute by" width="450">}}

`distribute by` 经常和 `sort by` 配合使用。

{{<image src="/images/配合.png" caption="distribute by 和 sort by 配合" width="450">}}

## cluster by

当 distribute by 和 sort by 所指定的字段相同时，即可以使用 `cluster by`。

```sql
select 
    * 
from wedw_dw.province_city_info 
distribute by in_come 
sort by in_come asc;
```

{{<image src="/images/by.png" caption="所指定的字段相同" width="450">}}

{{< admonition abstract "注意" true>}}
cluster by 指定的列只能是升序，不能指定 asc 和 desc。
{{< /admonition >}}

```sql
select 
    * 
from wedw_dw.province_city_info 
cluster by in_come;
```

{{<image src="/images/cluster.png" caption="cluster by" width="450">}}


[^1]: [order by, sort by, distribute by, cluster by 区别](https://blog.csdn.net/zhou4411781/article/details/119934339)


