# SQL-MySQL窗口函数和单行函数的使用


窗口函数也叫OLAP函数（[Online Anallytical Processing]^(联机分析处理)），可以对数据进行实时分析处理。窗口函数是面试中考察的重点。窗口函数通常用来解决统计**汇总**、**排名**、**TopN**、**连续登录天数**等问题。
<!--more-->

## 窗口函数

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

### 排序函数

- `row_number()`：对每一行分配一个序号，序号连续加1，不会重复。常用于排序。
- `rank()`：给每行分配一个序号，相同值的序号相同，序号不连续。常用于排序。
- `dense_rank()`：给每行分配一个序号，相同值的序号相同，序号连续。常用于排序。

### 分布函数

- `percent_rank()`：每行按照公式$(rank-1) / (rows-1)$进行计算。其中，`rank` 为 `RANK()` 函数产生的序号，`rows` 为当前窗口的记录总行数。
- `cume_dist()`：分组内小于、等于当前 `rank` 值的行数 / 分组内总行数

### 相对位置函数

- `lag(expr,n)`：返回位于当前行的前 `n` 行的值
- `lead(expr,n)`：返回位于当前行的后 `n` 行的值

### 绝对位置函数

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

### 分桶函数

- `ntile(n)`：对每个分区继续分成 `n` 组，每组的行数为：分区的总行数 / `n`。不常用。

## 日期时间函数

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

## 流程函数

- `IF(value,t ,f)` 如果 `value` 是真，返回 `t`，否则返回 `f`
- `IFNULL(value1, value2)` 如果 `value1` 不为空，返回 `value1`，否则返回 `value2`
- `CASE WHEN`

## 数学函数

- `ABS(x)` 返回 `x` 的绝对值
- `CEIL(x)` 返回大于 `x` 的最小整数值
- `FLOOR(x)` 返回小于 `x` 的最大整数值
- `MOD(x,y)` 返回 `x/y` 的模
- `RAND(x)` 返回 0~1 的随机值，`x`可以不写
- `ROUND(x,y)` 返回参数 `x` 的四舍五入的有 `y` 位的小数的值
- `TRUNCATE(x,y)` 返回数字 `x` 截断为 `y` 位小数的结果
- `SQRT(x)` 返回 `x` 的平方根
- `POW(x,y)` 返回 `x` 的 `y` 次方

## 字符串函数

- `CONCAT(S1,S2,......,Sn)` 连接 `S1, S2, ......, Sn` 为一个字符串
- `CONCAT_WS(separator, S1, S2, ......, Sn)` 同 `CONCAT(s1, s2, ...)` 函数，但是每个字符串之间要加上分隔符 [separator]^(分隔符)
- `TRIM(s)` 去掉字符串 `s` 开始与结尾的空格

