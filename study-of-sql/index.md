# 数仓之SQL篇


本文主要摘抄数仓中的一些 SQL 问题，包括一些常用的语法和练习题，以便后续查阅复习。
<!--more-->

## MySQL窗口函数和单行函数的使用

### 窗口函数

窗口函数也叫OLAP函数（[Online Anallytical Processing]^(联机分析处理)），可以对数据进行实时分析处理。窗口函数是面试中考察的重点。窗口函数通常用来解决统计**汇总**、**排名**、**TopN**、**连续登录天数**等问题。

语法：函数名(字段名) over(partition by <要分列的组> order by <要排序的列> rows between <数据范围>)

数据范围：通过下面的案例来讲解数据范围如何使用。

```sql
# 取本行和前面两行
rows between 2 preceding and current row

# 取本行和之前所有的行 
rows between unbounded preceding and current row

# 取本行和之后所有的行
rows between current row and unbounded following

# 从前面三行和下面一行，总共五行
rows between 3 preceding and 1 following 

# 当order by后面没有rows between时，窗口规范默认是取本行和之前所有的行
# 当order by和rows between都没有时，窗口规范默认是分组下所有行（rows between unbounded preceding and unbounded following）
```

分类：按照窗口函数的意义大概可以分为下面 5 类，其中排序函数最为常用。

- 排序函数：`row_number()、rank()、dense_rank()`
- 分布函数：`percent_rank()、cume_dist()`
- 相对位置函数：`lag(expr,n)、lead(expr,n)`，用于返回某字段的前 `n` 行或后 `n` 行的值。`expr` 既可以是表达式也可以是列名。
- 绝对位置函数：`first_value(expr)、last_value(expr)、nth_value(expr,n)`，返回第一个或最后一个或第 `n` 个 `expr` 的值。
- 分桶函数：`ntile(x)`

另外，聚合函数也可以作为窗口函数使用：

聚合函数：`avg()，sum()，min()，max()`

#### 排序函数

- `row_number()`：对每一行分配一个序号，序号连续加1，不会重复。常用于排序。
- `rank()`：给每行分配一个序号，相同值的序号相同，序号不连续。常用于排序。
- `dense_rank()`：给每行分配一个序号，相同值的序号相同，序号连续。常用于排序。

#### 分布函数

- `percent_rank()`：每行按照公式$(rank-1) / (rows-1)$进行计算。其中，`rank` 为 `RANK()` 函数产生的序号，`rows` 为当前窗口的记录总行数。
- `cume_dist()`：分组内小于、等于当前 `rank` 值的行数 / 分组内总行数

#### 相对位置函数

- `lag(expr,n)`：返回位于当前行的前 `n` 行的值
- `lead(expr,n)`：返回位于当前行的后 `n` 行的值

#### 绝对位置函数

- `first_value(expr)`：返回第一个 `expr` 的值。
- `last_value(expr)`：返回最后一个 `expr` 的值。
- `nth_value(expr,n)`：返回窗口中第 `n` 个 `expr` 的值。

**应用场景 1** 举例：求首次登录和末次登录时间

```sql
select
    id,
    log_dt,
    first_value(log_dt) over(partition by id order by log_dt) f_dt,
    last_value(log_dt) over(partition by id order by log_dt) l_dt
from tb;
```

| id | log_dt |f_dt | l_dt | 
|:------:| :-----:| :------:| :-----:| 
| 1 | 2020-11-10 | 2020-11-10 | 2020-11-10 | 
| 1 | 2021-01-20 | 2020-11-10 | 2021-01-20 | 
| 1 | 2021-08-12 | 2020-11-10 | 2021-08-12 |  
| 2 | 2021-12-05 | 2021-12-05 | 2021-12-05 | 
| 2 | 2021-12-29 | 2021-12-05 | 2021-12-29 | 

**应用场景 2** 举例：求部门中工资第二的员工

```sql
SELECT
    id,
    dept_id did,
    salary s,
    NTH_VALUE(salary,2) over(PARTITION BY dept_id ORDER BY salary DESC) s2
FROM employee;
```

| id | did | s | s2 | 
|:------:| :-----:| :------:| :-----:| 
| 2 | 1 | 200 | 100 | 
| 1 | 1 | 100 | 100 | 
| 4 | 2 | 400 | 300 | 
| 3 | 2 | 300 | 300 | 
| 6 | 3 | 560 | 500 | 
| 5 | 3 | 500 | 500 | 

#### 分桶函数

- `ntile(n)`：对每个分区继续分成 `n` 组，每组的行数为：分区的总行数 / `n`。不常用。

### 日期时间函数

- `CURDATE()` 或 `CURRENT_DATE()` 返回当前日期
- `NOW()` 返回当前系统日期时间
- `YEAR(date)` 返回年
- `MONTH(date)` 返回月
- `DAY(date)` 返回日
- `DATEDIFF(date1,date2)` 返回 `date1 - date2` 的日期间隔
- `DATE_FORMAT(datetime ,fmt)` 按照字符串 `fmt` 格式化日期 `datetime` 值。
    - `%Y` 4 位数字表示年份
    - `%m` 两位数字表示月份（01,02,03,...）
    - `%d` 两位数字表示月中的天数(01,02...)
    - `%H` 两位数字表示小时，24小时制（01,02,...）

### 流程函数

- `IF(value,t ,f)` 如果 `value` 是真，返回 `t`，否则返回 `f`
- `IFNULL(value1, value2)` 如果 `value1` 不为空，返回 `value1`，否则返回 `value2`
- `CASE WHEN`

### 数学函数

- `ABS(x)` 返回 `x` 的绝对值
- `CEIL(x)` 返回大于 `x` 的最小整数值
- `FLOOR(x)` 返回小于 `x` 的最大整数值
- `MOD(x,y)` 返回 `x/y` 的模
- `RAND(x)` 返回 0~1 的随机值，`x`可以不写
- `ROUND(x,y)` 返回参数 `x` 的四舍五入的有 `y` 位的小数的值
- `TRUNCATE(x,y)` 返回数字 `x` 截断为 `y` 位小数的结果
- `SQRT(x)` 返回 `x` 的平方根
- `POW(x,y)` 返回 `x` 的 `y` 次方

### 字符串函数

- `CONCAT(S1,S2,......,Sn)` 连接 `S1, S2, ......, Sn` 为一个字符串
- `CONCAT_WS(separator, S1, S2, ......, Sn)` 同 `CONCAT(s1, s2, ...)` 函数，但是每个字符串之间要加上分隔符 [separator]^(分隔符)
- `TRIM(s)` 去掉字符串 `s` 开始与结尾的空格

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

- 新用户占比 = 当天的新用户数 ÷ 当天活跃用户数（日活数）。
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

## 用户留存分析

n日留存率 = 第 n 天还在登录的用户数/新增的用户数，假如某日新增了 100 个用户，第二天登录了 50 个，则次日留存率为 50/100 = 50%，第三天登录了 30 个，则第二日留存率为 30/100 = 30%，以此类推，第 7 天登录了 10 个用户，则 7 日留存率就是 10/100 = 10%。

首先，我们需要计算出每个user的首次登录日期，也就是下面的代码。

```sql
SELECT 
    user_id, 
    MIN(log_date) AS first_log_date 
FROM user_log 
GROUP BY user_id
```

然后，我们和 `user_log` 表进行关联之后再进行日期差的计算，这就得到了某一天登录离第一次登录有多长时间。

```sql
--用户留存计算
SELECT
    first_log_date,
    SUM(CASE WHEN t3.diff_days = 0 THEN 1 ELSE 0 END) AS day_0,
    SUM(CASE WHEN t3.diff_days = 1 THEN 1 ELSE 0 END) AS day_1,
    SUM(CASE WHEN t3.diff_days = 2 THEN 1 ELSE 0 END) AS day_2,
    SUM(CASE WHEN t3.diff_days = 3 THEN 1 ELSE 0 END) AS day_3,
    SUM(CASE WHEN t3.diff_days = 4 THEN 1 ELSE 0 END) AS day_4,
    SUM(CASE WHEN t3.diff_days = 5 THEN 1 ELSE 0 END) AS day_5,
    SUM(CASE WHEN t3.diff_days = 6 THEN 1 ELSE 0 END) AS day_6,
    SUM(CASE WHEN t3.diff_days = 7 THEN 1 ELSE 0 END) AS day_7 
FROM
(
    SELECT
        t1.user_id,
        t2.first_log_date,
        DATEDIFF(DAY, t2.first_log_date, t1.log_date) AS diff_days 
    FROM user_log AS t1
    LEFT JOIN 
    (
        SELECT 
            user_id, 
            MIN(log_date) AS first_log_date 
        FROM user_log 
        GROUP BY user_id 
    ) as t2 
        ON t1.user_id = t2.user_id 
) AS t3 
GROUP BY first_log_date
```













