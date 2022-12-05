# Mysql 面试题


史上最全的大厂 Mysql 面试题在这里。
<!--more-->
    
## MySQL 中 myisam 与 innodb的区别

### 问 5 点不同

1. InnoDB 支持事物，而 MyISAM 不支持事物
1. InnoDB 支持行级锁，而 MyISAM 支持表级锁
1. InnoDB 支持 MVCC, 而 MyISAM 不支持
1. InnoDB 支持外键，而 MyISAM 不支持
1. InnoDB 不支持全文索引，而 MyISAM 支持。

### innodb 引擎的 4 大特性

- [插入缓冲]^(insert buffer)
- [二次写]^(double write)
- [自适应哈希索引]^(ahi)
- [预读]^(read ahead)

### 2 者 select count(*) 哪个更快，为什么

myisam 更快，因为 myisam 内部维护了一个计数器，可以直接调取。









