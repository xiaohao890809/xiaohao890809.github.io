# dub老师给滴题目准备


头条大佬 dubhe 老师给的题目准备，好好刷一下。
<!--more-->
    
## SQL 类型

### 成绩排名

学生成绩表 student,course,score，记录每个学生每门课程（共语文、数学、英语 3 门课）的成绩，请用 SQL 找出每门课程成绩排名前 5 的学生。

```sql
select
    a.course,
    a.student
from 
(
    select 
        scoure,
        student,
        row_number() over (partition by course order by socre desc) rn
    from tab1
) as a 
where a.rn <= 5;
```

### 平均分和总分最高

table1:<br>
student_id,class

table2:<br>
student_id,course,score

1. 求各个班级，每一门课程的平均分
1. 求各个班级，总分最高的学生

```sql
select
    a.class,
    b.course,
    avg(b.score) as score_avg
from table1 as a 
left join table2 as b 
    on a.student_id = b.student_id
group by 1,2
```

```sql
select
    a.class,
    a.student_id,
    a.score_sum
from 
(
    select
        a.class,
        a.student_id,
        a.score_sum,
        row_number() over (partition by a.class order by a.score_sum desc) as rn
    from 
    (
        select
            a.class,
            a.student_id,
            sum(b.score) as score_sum
        from table1 as a 
        left join table2 as b 
            on a.student_id = b.student_id
        group by 1,2
    ) as a 
) as a 
where a.rn = 1
```

### ip 访问次数前 5

给定 hive 表 t1，包含三列，user_id、ip、time：表示 user_id 在时间 time 访问过一次 ip。请利用 hive-sql 计算每个 ip 访问次数排名前 5 的 user_id。

```sql
select
    a.ip,
    a.user_id,
    a.cnt
from 
(
    select
        a.ip,
        a.user_id,
        a.cnt,
        row_number() over (partition by a.ip order by a.cnt desc) as rn 
    from 
    (
        select
            ip,
            user_id,
            count(time) as cnt
        from t1
        group by 1,2
    ) as a 
) as a 
where a.rn <= 5
```

### 数据清洗

客户端每隔几分钟都会上报一条记录，形式如 uid、time，我们做数据清洗的时候要求：如果 10 分钟内上报多条的话，就只保留最早的一条。请问怎么用 SQL 实现。

```sql
// 将一个时间维表(分钟维度存储按照 10 分钟进行 N 等分)
with time_tmp as 
(
    select
        time_format, // 格式 12:10
        ntile(24*60/10) over (order by time) as time_rn
    from dim_time 
) 

select 
    a.uid,
    a.time
from 
(
    select
        a.uid,
        a.time,
        row_number() over (partition by b.time_rn order by a.time) rn 
    from table1 as a 
    left join time_tmp as b 
        on concat(hour(a.time), ':', minute(a.time)) = b.time_format
) as a 
where a.rn = 1
```

### 充值额最大的账号 

假设有一个用户充值日志表 A，字段如下

字段 类型 含义<br>
dist_id int 区组id<br>
account string 账号<br>
money int 充值金额<br>
create_time string 订单时间

求解：统计某一天各区组下充值额最大的账号以及金额。 

```sql
select
    a.dist_id,
    a.account,
    a.money
from 
(
    select
        a.dist_id,
        a.account,
        a.money,
        row_number() over (partition by a.dist_id order by a.money desc) rn
    from tab1 as a 
    where date(a.create_time) = '2022-10-01'
) as a 
where a.rn = 1
```

### 观看视频

根据要求写出对应的 sql 语句

表A：用户浏览视频日志 user_behavior:date,user_id,video_id,start_time,end_time<br>
表B：视频信息 video_info:video_id,video_duration<br>
表C：用户信息 user_info:user_id,gender

问题：

1. 某一天（如20200310），观看不同视频个数最多的前 5 名 user_id
1. 观看超过 50 个不用视频的女性用户中，完整观看率最高的 10 个 user_id

```sql
select
    a.user_id,
    count(distinct a.video_id) as cnt
from tab_a as a 
where a.date = '20200310'
order by 2 desc 
limit 5
```

```sql
select
    a.user_id,
    a.video_finish_cnt / a.video_cnt as finish_rate
from 
(
    select
        a.user_id,
        count(distinct a.video_id) over (partition by a.user_id) as video_cnt,
        count(distinct case when unix_timestamp(a.end_time) - unix_timestamp(a.start_time) >= b.video_duration then a.video_id end) over (partition by a.user_id) as video_finish_cnt,
        row_number() over (partition by a.user_id order by a.start_time) rn
    from tab_a as a 
    left join tab_b as b 
        on a.video_id = b.video_id
    left join tab_c as c 
        on a.user_id = c.user_id
    where a.date = '20200310' and c.gender = '女'
) as a 
where a.video_cnt >= 50 and a.rn = 1
order by 2 desc 
limit 10
```

### 页面 session 时长计算 

用户在浏览页面时，前端以 1 次/s 的频率上报后端，假如连续 30s 后端未收到上报，可以认为一次访问 session 已经结束，使用 hivesql/sparksql 求每次 session 的信息（只有一条记录时任务是 1s）。

示例：

表名为：page_upload_info，单次上报数据结构如下：

user_id->用户id，create_ts->上报时间戳（单位：秒），假如有下数据（数据未排序）：

user_id->1,create_ts->10000<br>
user_id->1,create_ts->10010<br>
user_id->1,create_ts->10003<br>
user_id->1,create_ts->10070<br>
user_id->2,create_ts->10000<br>
user_id->2,create_ts->10003

解答：应返回 3 条结果，分别是：

user_id->1,session->10s,start_ts->10000,end_ts->10010<br>
user_id->1,session->1s,start_ts->10070,end_ts->10070<br>
user_id->2,session->3s,start_ts->10000,end_ts->10003

```sql
select
    a.user_id,
    case when a.end_ts = a.create_ts then 1 else a.end_ts - a.create_ts end as session,
    a.start_ts,
    a.end_ts
from 
(
    select
        a.user_id,
        a.f_group,
        min(a.create_ts) as start_ts,
        max(a.create_ts) as end_ts
    from 
    (
        select
            a.user_id,
            a.create_ts,
            sum(f_flag) over (partition a.user_id order by a.create_ts desc) f_group
        from 
        (
            select
                a.user_id,
                a.create_ts,
                case when a.diff_create_ts >= 30 or a.diff_create_ts is null then 1 else 0 end as f_flag
            from 
            (
                select
                    a.user_id,
                    a.create_ts,
                    lead(a.create_ts, 1, null) over (partition by a.user_id order by a.create_ts) - a.create_ts as diff_create_ts
                from page_upload_info as a
            ) a 
        ) a
    ) a
    group by 1,2
) a 
```

### 留存，和连续活跃

1、用户活跃模型表：user_daily<br>
以 imp_date、user_id 为主键，一个用户 1 天只出现一次，出现即表示当日登陆字段：

字段：<br>
imp_date 时间，user_id 用户id，is_new 是否新用户，0-老用户，1-新用户

2、红包领取日志：money_flow

字段：<br>
imp_date 时间，report_time 红包领取时间戳，用户id，add_money 领取金额

题目1：最近 1 个月每日未领红包用户的次日留存率和 7 日留存<br>
题目2：最近 1 个月，每日 DAU 中，3 天连续活跃用户的占比

```sql
select
    a.imp_date,
    count(case when b.user_id is not null then a.user_id end)/count(a.user_id) as f_remain_1d_rate,
    count(case when c.user_id is not null then a.user_id end)/count(a.user_id) as f_remain_7d_rate
from 
(
    select
        a.imp_date,
        a.user_id
    from user_daily as a
    left join money_flow as b 
        on a.imp_date = b.imp_date and a.user_id = b.user_id
    where date_diff(current_date, a.imp_date) <= 30 and date_diff(current_date, b.imp_date) <= 30
          and b.user_id is null 
) a
left join user_daily b 
    on date_diff(b.imp_date, a.imp_date) = 1 and a.user_id = b.user_id
left join user_daily c 
    on date_diff(c.imp_date, a.imp_date) = 7 and a.user_id = c.user_id
group by 1
```

```sql
select
    a.imp_date,
    count(case when b.user_id is not null and c.user_id is not null then a.user_id end)/count(a.user_id)  as f_3d_continue_rate
from user_daily as a 
left join user_daily as b 
    on date_diff(a.imp_date, b.imp_date) = 1 and a.user_id = b.user_id
left join user_daily as c
    on date_diff(a.imp_date, c.imp_date) = 2 and a.user_id = c.user_id
where date_diff(current_date, a.imp_date) <= 30
group by 1
```

## 算法题

### x的平方根

:link: [x的平方根](https://xiaohao890809.github.io/sqrtx)

### 字符串相加

:link: [字符串相加](https://xiaohao890809.github.io/add-strings)

### 平方数之和

:link: [字符串相加](https://xiaohao890809.github.io/sum-of-square-numbers)

### 最长回文子串

:link: [最长回文子串](https://xiaohao890809.github.io/longest-palindromic-substring)

### 查询两个字符串的最长公共子串

:link: [查询两个字符串的最长公共子串](https://xiaohao890809.github.io/longest)

### 单词拆分

:link: [单词拆分](https://xiaohao890809.github.io/word-break)


## 编程类

### 统计kv

有一份数据有 n 行，每一行是一个由逗号、冒号间隔的字符串（例如 "a:10,b,20,c:30"），逗号拆分后每个都是字符串类型的 "key:value"。现需要统计每个 key 的 value 求和，可尝试用 python 或 hive/sql 或 spark 实现。

(1) 若 python 实现，则输入为一个list：`lis1 = ['a:10,b:20,c:30', 'a:100,dog:200', 'hi:40,b:10', 'dog:20']`<br>
(2) 若 hive/sql 实现，则输入可设为一个表 A，且仅一列数据。

| info       | 
| :--------: |
| a:10,b:20,c:30 | 
| a:100,dog:200 | 
| hi:40,b:10 |
| dog:20 | 
| ...... | 

(3) 若 saprk 实现，则输入可设为一个 rdd/dateframe

最终求得：a: 110, b: 30, c: 30, dog: 220, hi: 40。

答：

```python
lis1 = ['a:10,b:20,c:30', 'a:100,dog:200', 'hi:40,b:10', 'dog:20']

ret_dict = {}

for item in lis1:
    item_list = item.split(',')
    for i in item_list:
        k = i.split(':')[0]
        v = int(i.split(':')[1])
        if k in ret_dict:
            ret_dict[k] += v
        else:
            ret_dict[k] = v

print(ret_dict)
```

```sql
select
    concat_ws(',', collect_list(concat(k,':',v))) as ret
from 
(
    select
        k,
        sum(v) as v 
    from 
    (
        select 
            split(value1, ':')[0] as k,
            cast(split(value1, ':')[1] as int) as v
        from tmp_2022120501 t lateral view explode(split(t.my_str, ',')) t1 as value1
    ) as a 
    group by 1
) as a 
```












