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

















