# SQL-连续 7 天都登陆平台


找出连续 7 天都登陆平台的用户。
<!--more-->

现有用户登陆表 user_login_table 如下：

- user_name 用户名
- date 用户登陆时间

现在老板想知道连续 7 天都登陆平台的重要用户。

输出要求如下：

- user_name 用户名（连续 7 天都登陆的用户数）

{{< admonition tip "思路1" true>}}
首先利用偏移窗口函数 lead 求得每个用户在每个登陆时间向后偏移 7 行的登陆时间，再计算每个用户在每个登陆时间**滞后 7 天**的登陆时间，如果每个用户向后偏移 7 行的登陆时间正好等于滞后 7 天的时间，说明该用户连续登陆了 7 天。
{{< /admonition >}}

```sql
select 
    user_name
from 
(
    select
        user_name,
        log_date,
        lead(log_date, 7) over (partition by user_name order by log_date) log_date_7
    from 
    (
        select 'A' user_name, '2020-01-01' log_date union all
        select 'A' user_name, '2020-01-02' log_date union all
        select 'A' user_name, '2020-01-03' log_date union all
        select 'A' user_name, '2020-01-04' log_date union all
        select 'A' user_name, '2020-01-05' log_date union all
        select 'A' user_name, '2020-01-06' log_date union all
        select 'A' user_name, '2020-01-07' log_date union all
        select 'A' user_name, '2020-01-08' log_date union all
        select 'A' user_name, '2020-01-19' log_date 
    )
)
where log_date_7 is not null and date_add(log_date, 7) = log_date_7;
```

{{< admonition tip "思路2" true>}}
把用户每天登陆的日期进行排序，如果用**当前天数减去序号**，连续 3 天的话相同的数据就有 7 个
{{< /admonition >}}

```sql
select
    user_id,
    count(1) cnt
from
(
    select
        user_id,
        login_date,
        row_number() over(partition by user_id order by login_date) rn
    from tab1
)
group by user_id,date_sub(login_date, rn)
having count(1) >= 7;
```
