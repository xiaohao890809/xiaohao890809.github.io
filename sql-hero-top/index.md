# SQL-英雄出场排名top3的出场次数及出场率


求英雄的出场排名 `top3` 的出场次数及出场率。`names` 代表英雄名字。
<!--more-->

|  id  |  names  |
| :--: | :--: |
| 1 | aa,bb,cc,dd,ee |
| 2 | aa,bb,ff,ww,qq | 
| 3 | aa,cc,rr,yy | 
| 4 | aa,bb,dd,oo,pp |

```sql
select
    name,
    cnt,
    cast(cnt/all_cnt as decimal(3,1)) as ratio
from 
(
    select
        name,
        cnt,
        sum(cnt) over () as all_cnt,
        dense_rank() over (order by cnt desc) as rn
    from 
    (
        select
            name,
            count(1) as cnt
        from tmp_2022120501 lateral view explode(split(my_str, ',')) t as name
        group by 1
    ) a 
) a 
where rn <= 3;
```

