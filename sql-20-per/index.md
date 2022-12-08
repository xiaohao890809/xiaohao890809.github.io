# SQL-支付金额在前 20% 的用户


找出支付金额在前 20% 的用户。
<!--more-->

{{< admonition tip "思路" true>}}
利用 `ntile`
{{< /admonition >}}

```sql
select
    user_name
from 
(
    select
        user_name,
        ntile(5) over(order by sum(pay_amt) desc) as level
    from 
    (
        select 'A' user_name, 100 pay_amt union all
        select 'A' user_name, 10 pay_amt union all
        select 'A' user_name, 300 pay_amt union all
        select 'B' user_name, 100 pay_amt union all
        select 'B' user_name, 1090 pay_amt union all
        select 'C' user_name, 1030 pay_amt union all
        select 'D' user_name, 70 pay_amt union all
        select 'F' user_name, 770 pay_amt union all
        select 'G' user_name, 710 pay_amt union all
        select 'E' user_name, 800 pay_amt 
    )
    group by 1
)
where level = 1;
```
