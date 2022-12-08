# 大数据——Hive SQL优化


本文介绍一些 `hive` 的常见优化方案。
<!--more-->

## SELECT 字段尽可能少，数据过滤尽可能提前

{{<image src="/images/SELECT.png" caption="SELECT" width="650">}}

## 能不用 JOIN 连接的就不用

{{<image src="/images/join.png" caption="join" width="550">}}

## 数据倾斜问题

### JOIN 优化

选用 `join key` 分布最均匀的表作为驱动表，并且大表放在右边，小表放在左边。

### 排序优化

`sort by` 代替 `order by`

### 少用count(distinct)

用 `group by` 代替 `count(distinct)`

```sql
select count(*) from (select uid from testmac group by uid) t
```

## 多表 join 时 key 保持一致

当对多个表进行 join 连接时，如果每个 on 子句都使用相同的连接键的话，那么只会产生一个 MapReduce job，执行效率相对快。

## 去除空值和无意义的值

出现空值或无意义值时，如null，空字符串、-1等，在做 join 时这些空值就会非常集中，拖累进度。因此，若不需要空值数据，就提前写 where 语句过滤掉。若需要保留，将空值 null 的记录**随机改为负值**：





