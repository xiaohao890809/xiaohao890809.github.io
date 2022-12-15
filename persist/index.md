# cache 和 persist 区别


cache 和 pesist 的区别？
<!--more-->

- cache() 是 persist() 的**特例**，persist 可以指定一个 [StorageLevel]^(缓存级别)
- cache 的缓存级别是 `memory_only`
- cache 默认是在内存中存储的，而 persist 可以设置存储的级别

{{<image src="/images/cache.png" caption="持久化级别" width="750">}}




















