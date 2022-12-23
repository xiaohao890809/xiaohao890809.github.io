# 学习刷题Part1


## 比特和波特

关于比特和波特，下面说法正确的是( )。

(A) 比特和波特施一个概念

(B) 比特是码元传输速率单位

(C) 波特是信息量单位

(D) 在某些情况下，“比特/秒”和“波特”在数值上是相等的

{{< admonition question "参考答案" false >}}
正确答案: D

- <u>比特</u> 比特率是信息量传送速率单位，即每秒传输二 进制代码位数。bit/s
- <u>波特</u> 波特率是码元传输速率单位，他说明单位时间 传输了多少个码元
{{< /admonition >}}

## Hive内外表

下面关于Hive内外表描述正确的是（）

(A) 内部表数据由HDFS自身管理，外部表数据由Hive管理；

(B) 内部表数据存储的位置是hive.metastore.warehouse.dir设置配置（默认：/user/hive/warehouse）

(C) 外表存储必须指定LOCATION

(D) 内外表删除时，都会删除元数据和存储

{{< admonition question "参考答案" false >}}
正确答案: B

- A.错误，内部表数据由Hive自身管理，外部表数据由HDFS管理；
- B.正确，Hive config默认设置
- C.错误，外表存储不指定LOCATION时，Hive将在HDFS上的/user/hive/warehouse文件夹下以外部表的表名创建一个文件夹，并将属于这个表的数据存放在这里
- D.错误，只有内表删除时，才会删除元数据和存储；外表只会删掉元数据
{{< /admonition >}}

## Hive的ORC

下面关于Hive的ORC格式描述正确的是（）

(A) ORC的存储方式：数据按行分块 每块按照列存储

(B) ORC不可以进行压缩

(C) RC效率比ORC高，是ORC的改良版本

(D) ORC格式是Hive默认的建表格式

{{< admonition question "参考答案" false >}}
正确答案: A

- A.正确，ORC文件的规范是数据按行分块，在由块按照列存储
- B.错误，ORC可以进行快速的存取和压缩
- C.错误，ORC效率比RC高，是RC的改良版本
- D.错误，TEXTFILE格式是Hive默认的建表格式
{{< /admonition >}}

## 相关性分析

在相关性分析中需要相关的两个变量（）

(A) 因变量是随机的量，自变量也是随机的量

(B) 因变量是随机的量，自变量是控制的量

(C) 因变量是控制的量，自变量是随机的量

(D) 因变量是控制的量，自变量也是控制的量

{{< admonition question "参考答案" false >}}
正确答案: A

进行相关性分析时，不必事先确定两个变量中哪个是自变量哪个是因变量，相关性分析中两个变量都是随机的变量。
{{< /admonition >}}







