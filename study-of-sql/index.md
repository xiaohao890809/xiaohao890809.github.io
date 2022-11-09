# 数仓之SQL篇


本文主要摘抄数仓中的一些 SQL 问题，包括一些常用的语法和练习题，以便后续查阅复习。
<!--more-->

## 支付金额在前 20% 的用户

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

## 连续 7 天都登陆平台

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

## 平均活跃天数和月活人数

用户在牛客试卷作答区作答记录存储在表 `exam_record` 中，内容如下：

`exam_record`表（`uid` 用户 `ID`, `exam_id` 试卷 `ID`, `start_time` 开始作答时间, `submit_time` 交卷时间, `score` 得分）

| id   | uid  | exam_id | start_time          | submit_time         | score  |
| :----: | :----: | :-------: | :-------------------: | :-------------------: | :------: |
| 1    | 1001 | 9001    | 2021-07-02 09:01:01 | 2021-07-02 09:21:01 | 80     |
| 2    | 1002 | 9001    | 2021-09-05 19:01:01 | 2021-09-05 19:40:01 | 81     |
| 3    | 1002 | 9002    | 2021-09-02 12:01:01 | (NULL)              | (NULL) |
| 4    | 1002 | 9003    | 2021-09-01 12:01:01 | (NULL)              | (NULL) |
| 5    | 1002 | 9001    | 2021-07-02 19:01:01 | 2021-07-02 19:30:01 | 82     |
| 6    | 1002 | 9002    | 2021-07-05 18:01:01 | 2021-07-05 18:59:02 | 90     |
| 7    | 1003 | 9002    | 2021-07-06 12:01:01 | (NULL)              | (NULL) |
| 8    | 1003 | 9003    | 2021-09-07 10:01:01 | 2021-09-07 10:31:01 | 86     |
| 9    | 1004 | 9003    | 2021-09-06 12:01:01 | (NULL)              | (NULL) |
| 10   | 1002 | 9003    | 2021-09-01 12:01:01 | 2021-09-01 12:31:01 | 81     |
| 11   | 1005 | 9001    | 2021-09-01 12:01:01 | 2021-09-01 12:31:01 | 88     |
| 12   | 1006 | 9002    | 2021-09-02 12:11:01 | 2021-09-02 12:31:01 | 89     |
| 13   | 1007 | 9002    | 2020-09-02 12:11:01 | 2020-09-02 12:31:01 | 89     |

请计算 2021 年每个月里试卷作答区用户平均月活跃天数 `avg_active_days` 和月度活跃人数 `mau`，上面数据的示例输出如下：

| month  | avg_active_days | mau  |
| :------: | :---------------: | :----: |
| 202107 | 1.50            | 2    |
| 202109 | 1.25            | 4    |

**思路**

对于用户平均活跃天数，则需要得到用户的总活跃天数和不同的用户数。不同的用户数和月活的求解方式一样，总活跃天数则需要同时读用户和日期进行去重，因为如果同一天有多个用户活跃，则最终的总活跃天数中是会计算多天的。

```sql
select
    date_format(submit_time,'%Y%m') month,
    round(count(distinct uid,date_format(submit_time,'%Y%m%d'))/count(distinct uid),2) avg_active_days,
    count(distinct uid) mau
from exam_record
where year(submit_time)=2021
group by month;
```

## 每天的日活数及新用户占比

用户行为日志表 `tb_user_log`（`uid`-用户`ID`, `artical_id`-文章`ID`, `in_time`-进入时间, `out_time`-离开时间, `sign_in`-是否签到）

| id   | uid  | artical_id | in_time             | out_time            | sign_cin |
| :----: | :----: | :----------: | :-------------------: | :-------------------: | :--------: |
| 1    | 101  | 9001       | 2021-10-31 10:00:00 | 2021-10-31 10:00:09 | 0        |
| 2    | 102  | 9001       | 2021-10-31 10:00:00 | 2021-10-31 10:00:09 | 0        |
| 3    | 101  | 0          | 2021-11-01 10:00:00 | 2021-11-01 10:00:42 | 1        |
| 4    | 102  | 9001       | 2021-11-01 10:00:00 | 2021-11-01 10:00:09 | 0        |
| 5    | 108  | 9001       | 2021-11-01 10:00:01 | 2021-11-01 10:00:50 | 0        |
| 6    | 108  | 9001       | 2021-11-02 10:00:01 | 2021-11-02 10:00:50 | 0        |
| 7    | 104  | 9001       | 2021-11-02 10:00:28 | 2021-11-02 10:00:50 | 0        |
| 8    | 106  | 9001       | 2021-11-02 10:00:28 | 2021-11-02 10:00:50 | 0        |
| 9    | 108  | 9001       | 2021-11-03 10:00:01 | 2021-11-03 10:00:50 | 0        |
| 10   | 109  | 9002       | 2021-11-03 11:00:55 | 2021-11-03 11:00:59 | 0        |
| 11   | 104  | 9003       | 2021-11-03 11:00:45 | 2021-11-03 11:00:55 | 0        |
| 12   | 105  | 9003       | 2021-11-03 11:00:53 | 2021-11-03 11:00:59 | 0        |
| 13   | 106  | 9003       | 2021-11-03 11:00:45 | 2021-11-03 11:00:55 | 0        |

**问题**：统计每天的日活数及新用户占比

**注**：

- 新用户占比=当天的新用户数÷当天活跃用户数（日活数）。
- 如果`in_time`-进入时间和`out_time`-离开时间跨天了，在两天里都记为该用户活跃过。

新用户占比保留2位小数，结果按日期升序排序。

**输出示例**：

示例数据的输出结果如下

| dt         | dau  | uv_new_ratio |
| :----------: | :----: | :------------: |
| 2021-10-30 | 2    | 1.00         |
| 2021-11-01 | 3    | 0.33         |
| 2021-11-02 | 3    | 0.67         |
| 2021-11-03 | 5    | 0.40         |

{{< admonition tip "思路1" true>}}
日活就是每天访问的不同用户数，所以我们首先要得到一张登录表，登录表记录了每天登录的用户，并按天对用户进行了去重，也就是下面的 `t1`。而要统计新用户的占比，我们就需要识别每天登录用户中哪些用户是新用户（即第一次登录）。一个可行的思路是，使用窗口函数对每个用户的登录日期进行排序得到下面的 `t2`。统计的时候进行判断，如果统计当天该用户的序号为 1，则表示用户今天是第一次登录，即为新用户。
{{< /admonition >}}

```sql
with t1 as
(   # 用户登录表，记录了用户 id 和登录时间，对每天的登录用户进行了去重
    select 
        uid,
        date(in_time) dt
    from tb_user_log
    union # union 实现去重，union all 不去重
    select 
        uid,
        date(out_time) dt
    from tb_user_log
),
t2 as 
(   # 对每个用户的登录日期进行排序，注册日期的序号是 1
    select
        uid,dt,
        row_number() over(partition by uid order by dt) rn
    from t1
)
# 获得答案
select
    dt,
    count(uid) dau,
    round(sum(if(rn=1, 1, 0))/count(uid),2) uv_new_ration
from t2
group by dt
order by dt;
```

{{< admonition tip "思路2" true>}}
同样的思路得到用户登录表 `t1`。每个用户的注册日期肯定在登录表中是最小的，因此用 `min` 函数可以得到用户登录表即下面的 `t2`。最后在求解答案的时候，用 `t1 left join t2`，关联的字段是 `uid` 以及日期，由于使用了 `left join`，`t1` 中每个用户所有的登录日期都得到了保留，`count` 计数即可得到 `dau`，而 `t2` 表中不是当天注册的用户 `uid` 和 `reg_dt` 都为 `null`，同样使用 `count` 计数就能得到当天的新用户。
{{< /admonition >}}

```sql
with t1 as
(   # 用户登录表，记录了用户 id 和登录时间，对每天的登录用户进行了去重
    select 
        uid,
        date(in_time) dt
    from tb_user_log
    union
    select 
        uid,
        date(out_time) dt
    from tb_user_log
),
t2 as 
(   # 得到用户注册表
    select
        uid,
        min(dt) reg_dt
    from t1
    group by uid
)
select
    dt,
    count(t1.uid) dau,
    round(count(t2.uid)/count(t1.uid),2) uv_new_ration
from t1 
left join t2 
    on t1.uid = t2.uid and t1.dt = t2.reg_dt
group by dt
order by dt;
```



