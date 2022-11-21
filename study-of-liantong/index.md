# 学习之联通沃音乐


本文主要摘联通沃音乐的一些题目，以便后续查阅复习 :yum:。
<!--more-->

## shell 题目

### 第 1 题

如何把文件 a.txt 赋权为755，另外解释 755 是什么权限？

{{< admonition tip "答案" true>}}

```shell
chmod 755 a.txt
````

具体的权限是由数字来表示的
- 读取的权限等于 4，用 r 表示；
- 写入的权限等于 2，用 w 表示；
- 执行的权限等于 1，用 x 表示；

以 755 为例：

- 1-3 位 7 等于 4+2+1，rwx，文件所有者具有读取、写入、执行权限；
- 4-6 位 5 等于 4+1+0，r-x，同组用户具有读取、执行权限但没有写入权限；
- 7-9 位 5，同上，也是 r-x，其他用户具有读取、执行权限但没有写入权限。

{{< /admonition >}}

### 第 2 题 

如何把文件 a.txt 重命名为 b.txt

{{< admonition tip "答案" true>}}
```shell
mv a.txt b.txt
```
{{< /admonition >}}

### 第 3 题

如何查询包含 a.sh 的所有进程，并进行批量杀进程？

{{< admonition tip "答案" true>}}

使用 `awk` 批量杀进程的命令

```shell
ps -ef | grep a.sh | grep -v grep | awk '{print "kill -9 "$2}'|sh
```

说明：

```shell
#列出了当前主机中运行的进程中包含a.sh关键字的进程
ps -ef | grep a.sh | grep -v grep    
 
#列出了要kill掉这些进程的命令，并将之打印在了屏幕上 
ps -ef | grep a.sh | grep -v grep | awk '{print "kill -9 "$2}'
 
#后面加上|sh后，则执行这些命令，进而杀掉了这些进程
ps -ef | grep a.sh | grep -v grep | awk '{print "kill -9 "$2}' | sh
```

{{< /admonition >}}

### 第 4 题

请列举 vi 的 6 种命名及其用途

- i: 在光标前插内内容
- x: 删除光标后面的字符
- yy: 复制整行
- :w 保存
- :q 退出
- :q! 强制退出
- :w! 强制保存

### 第 5 题

文件 a.txt 只有一列数据，请进行排序剔重得到 b.txt？

a.txt &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; b.txt<br>
12 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 12<br>
45 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 35<br>
48 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; => &nbsp;&nbsp;&nbsp;&nbsp; 45<br>
35 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 48<br>
85 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 85<br>
45<br>
35

{{< admonition tip "答案" true>}}
```shell 
sort -u a.txt > b.txt
```

默认是升序，降序的话加上 -r
{{< /admonition >}}

### 第 6 题

请写一个 shell 循环得到 1 到 100 的相加之和。

{{< admonition tip "答案" true>}}

```shell 
vim sum1_100.sh

#!/bin/bash
sum = 0 
for i in {1..100}
do
    let sum = sum + i
done 
$echo $sum

chmod +x sum1_100.sh

sh sum1_100.sh 或者 ./sum1_100.sh
```

{{< /admonition >}}

## 数据库题

### 第 7 题

以表 a 作为主表，外连接表 b，得出表 c。

{{<image src="/images/tab1.png" caption="数据表">}}

{{< admonition tip "答案" true>}}
```sql
select
    a.id,
    a.Score1,
    coalesce(b.Score2, '') as Score2
from tab1 a 
left join tab2 b
    on a.id = b.id
```
{{< /admonition >}}

### 第 8 题

参加一个活动，表 a 记录了活动的年龄及该年龄的人数，现需要求出表 b 年龄分段的人数。

{{<image src="/images/tab2.png" caption="数据表">}}

{{< admonition tip "答案" true>}}
```sql
select
    case 
        when age >= 0 and age < 10 then '[0,10)'
        when age >= 10 and age < 20 then '[10,20)'
        when age >= 20 and age < 30 then '[20,30)'
        when age >= 30 then '大于30' end as Age,
    sum(cnt) as Cnt
from tab1 a 
group by 1
```
{{< /admonition >}}

### 第 9 题

表 a 有学生 id 及其成绩，现做排名得出表 b

{{<image src="/images/tab3.png" caption="数据表">}}

{{< admonition tip "答案" true>}}
```sql
select
    a.id,
    a.Score,
    rank() over (order by Score desc) pm
from tab1 a 
order by id
```
{{< /admonition >}}

### 第 10 题

每天 1000 万条的数据（有时间（具体到秒），字段2，字段3，字段4......）从前端写入数据库，如何设置表结构，可以快速的查询到 2017年3月11日20点31分到32分的所有数据？


{{< admonition tip "答案" true>}}

思路是把时间进行拆解，按照天+小时+分钟的格式，然后对时间字段加上索引，这样查询的速度就会提升。

```sql
CREATE TABLE `tab1` (
  `f_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `f_date` varchar(64) NOT NULL DEFAULT '' COMMENT '日期',
  `f_hour` varchar(64) NOT NULL DEFAULT '' COMMENT '小时',
  `f_min` varchar(64) NOT NULL DEFAULT '' COMMENT '分钟',
   字段2，字段3....
  `f_update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (
    `f_id`
  ),
  KEY `all_index` (`f_date`, `f_hour`, `f_min`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COMMENT = '注释'
```
{{< /admonition >}}

### 第 11 题

如下图：表 a 是营业厅，所属区，地市，省销售金额，现得出表 b 区、地市和全省汇总

{{<image src="/images/tab4.png" caption="数据表">}}

{{< admonition tip "答案" true>}}
```sql
select
    City,
    Area,
    sum(amt) as amt 
from tab1
group by 1,2

union all 

select
    '全省' as City,
    '' as Area,
    sum(amt) as amt 
from tab1
group by 1,2

union all 

select
    City as City,
    '全市' as Area,
    sum(amt) as amt 
from tab1
group by 1,2
```
{{< /admonition >}}

### 第 12 题

表 a 字段是以日期作为分区表，有日期、用户id、产品id，使用的时间详细时间，每天有 50 亿条数据，即 31 天总数据为 1550 亿。需要每天得到一个表 b，以 b 表的日期、产品id为联合汇总，算出 1 号到当前的日期的 pv 和 uv。但 Hadoop 集群只能计算 100 亿数据，如何通过逻辑方式计算请写出具体 sql。答案需要考虑集群的计算能力，提示每天新增的用户大概 3 千万。

{{<image src="/images/tab5.png" caption="数据表">}}

{{< admonition tip "答案" true>}}

```sql
insert overwrite table tab_with_pv partition(static_dat='计算日')
select
    static_dat,
    product_id,
    count(user_id) pv
from tab1 
where static_dat = '计算日'
group by 1,2
```

pv 的计算

```sql
select
    static_dat,
    product_id,
    sum(pv) pv
from tab_with_pv 
where substr(static_dat,1,6) = '计算月' and static_dat <= '计算日'
group by 1,2
```

tab_with_user 这个表需要加上自依赖

```sql
insert overwrite table tab_with_user partition(static_dat='计算日')
select
    distinct 
    static_dat,
    product_id,
    user_id
from tab_with_user 
where static_dat = '计算日'

union 

select
    distinct 
    static_dat,
    product_id,
    user_id
from tab_with_user 
where static_dat = '计算日前一日' and substr(static_dat,1,6) = '计算月'
```

uv 的计算

```sql
select
    static_dat,
    product_id,
    count(distinct user_id) uv
from tab_with_user 
where static_dat = '计算日'
```

最后把 pv 和 uv 的数据拼接在一起即可。

{{< /admonition >}}

## JAVA题目

### 第 13 题

用代码或伪代码实现一个 java 限流工具类（说明：调用关系为我方系统调用对方系统，我方系统调用频次不能大于对方系统的限制，如：阿里云限制我方每秒调用不能大于1000次）。

{{< admonition tip "答案" true>}}
```java
public class RateLimiterSimpleWindow {
    // 阈值
    private static Integer QPS = 2;
    // 时间窗口（毫秒）
    private static long TIME_WINDOWS = 1000;
    // 计数器
    private static AtomicInteger REQ_COUNT = new AtomicInteger();
     
    private static long START_TIME = System.currentTimeMillis();
  
    public synchronized static boolean tryAcquire() {
        if ((System.currentTimeMillis() - START_TIME) > TIME_WINDOWS) {
            REQ_COUNT.set(0);
            START_TIME = System.currentTimeMillis();
        }
        return REQ_COUNT.incrementAndGet() <= QPS;
    }
  
    public static void main(String[] args) throws InterruptedException {
        for (int i = 0; i < 10; i++) {
            Thread.sleep(250);
            LocalTime now = LocalTime.now();
            if (!tryAcquire()) {
                System.out.println(now + " 被限流");
            } else {
                System.out.println(now + " 做点什么");
            }
        }
```
{{< /admonition >}}

### 第 14 题

假设在 5 台 linux 服务器上我们部署了 5 个应用实例（外部访问默认通过 ngix 负载），该应用涉及到文件的上传和下载，你会如何设计，保证用户上传文件和下载文件时不会出现异常问题，同时也需要保证存储数据访问的安全性（假设不能使用对象存储服务）。

## Python题目

### 第 15 题

现有一个 dataframe 对象 df，如下：

| name | age | sex | score |
| :--: | :--: | :--: | :--: |
| zhangsan | 10    |    | 50 |
| lisi |    | 女   | 60 |
|  | 12    |   男 | 90 |
| chenyi | 11    |  女  |  |
| chenhai | 9    |    | 64 |

请分别写出相关代码：

（1）将性别 sex 为空的使用男来替代；将 name 为空的记录删除；将 age、score 列为空的分别使用改列平均值替代。

```python
df["sex"].fillna("男", inplace = True) # 将性别 sex 为空的使用男来替代
df["name"].dropna() # 将 name 为空的记录删除
age_mean = df["age"].mean()
score_mean = df["score"].mean()
df["age"].fillna(age_mean, inplace = True)
df["score"].fillna(score_mean, inplace = True)
```

（2）完成 2.1 数据后，对性别进行分组汇总，得出每个性别的 score 汇总得分。
```python
df.groupby("sex").agg({"score":"sum"})
```

（3）找出分数大于平均分的记录，并输出 name 和 score
```python
df[df["score"] > df["score"].mean()][["name","score"]]  
```




















