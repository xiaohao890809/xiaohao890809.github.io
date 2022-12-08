# SQL-列转行


常用操作**列转行**的几种方法。
<!--more-->

## 数据准备 

```sql
create table t1 as 
select '1' as id ,'mike' as name ,'22' as age,'0' as gender
union all      
select '2' as id ,'kangkang' as name ,'19' as age,'1' as gender
```

## 使用 union 

```sql
select id,'name' as type,name as value
from t1
union all
select id,'age' as type,age as value
from t1
union all
select id,'gender' as type,gender as value
from t1
order by id
```

## 采用concat_ws() + posexplode()方法

```sql
select 
    id, 
    type, 
    value
from 
(
    select 
        t.id, 
        t1.pos1, 
        t1.value1 as value,
        t2.pos2, 
        t2.type2  as type
    from 
    (
        select 
            id, 
            concat_ws(',', name, age, gender) as value, 
            array('name', 'age', 'gender') as type
        from t1
    ) t
    lateral view posexplode(split(t.value, ',')) t1 as pos1, value1 
    lateral view posexplode(t.type) t2 as pos2, type2
) t
where t.pos1 = t.pos2
```

SQL简化如下：

```sql
select 
    id, 
    b.type2 as type, 
    a.value1 as value
from t1
    lateral view posexplode(split(concat_ws(',', t1.name, t1.age, t1.gender), ',')) a as pos1, value1
    lateral view posexplode(array('name', 'age', 'gender')) b as pos2, type2
where a.pos1 = b.pos2
```

## 采用explode()+case when方法

```sql
select 
    id, 
    type, 
    case type
        when 'name' then name
        when 'age' then age
        when 'gender' then gender
        else null end as value
from t1 lateral view explode(array('name', 'age', 'gender')) t2 as type
```


