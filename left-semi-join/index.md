# left semi join 和 left join 区别


left semi join 和 left join 有啥区别呢？
<!--more-->

## 使用对比

### a表数据

```sql
select * from wedw_dw.t_user;
```

{{<image src="/images/biaoa.png" caption="表A" width="300">}}

### b表数据

```sql
select * from wedw_dw.t_order;
```

{{<image src="/images/biaob.png" caption="表B" width="300">}}

### left join

```sql
select
    *
from wedw_dw.t_user t1
left join wedw_dw.t_order t2
    on t1.user_id = t2.user_id;
```

如图所示：a 表和 b 表所有的字段都会展示出来

{{<image src="/images/biaoc.png" caption="left join" width="450">}}

### left semi join

```sql
select
    *
from wedw_dw.t_user t1
left semi join wedw_dw.t_order t2
    on t1.user_id = t2.user_id;
```

如图所示：只能展示 a 表的字段，因为 `left semi join` 只传递表的 `join key` 给 `map` 阶段

{{<image src="/images/biaod.png" caption="left semi join" width="300">}}

### in

```sql
select
    *
from wedw_dw.t_user t1
where t1.user_id in (select user_id from wedw_dw.t_order);
```

如图所示：发现效果和 `left semi join` 是一样的

{{<image src="/images/biaod.png" caption="in" width="300">}}

### inner join

```sql
select
    *
from wedw_dw.t_user t1
inner join wedw_dw.t_order t2
    on t1.user_id = t2.user_id;
```

如图所示：不会对 b 表有去重操作，会一直遍历

{{<image src="/images/biaoe.png" caption="inner join" width="300">}}

## 总结

- `LEFT SEMI JOIN` 是 [IN/EXISTS]^(子查询) 的一种更高效的实现。
- `LEFT SEMI JOIN` 的限制是， `JOIN` 子句中右边的表只能在 `ON` 子句中设置过滤条件，在 `WHERE` 子句、`SELECT` 子句或其他地方都不行。
- 因为 `left semi join` 是 `in(keySet)` 的关系，遇到右表重复记录，左表会跳过，而 `join` 则会一直遍历。这就导致右表有重复值得情况下 `left semi join` 只产生一条，`join` 所以 `left semi join` 的性能更高。
- `left semi join` 是只传递表的 `join key` 给 `map` 阶段，因此 `left semi join` 中最后 `select` 的结果只许出现左表。因为右表只有 `join key` 参与关联计算了，而 `left join` 默认是整个关系模型都参与计算了。




















