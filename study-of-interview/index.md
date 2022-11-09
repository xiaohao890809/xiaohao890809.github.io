# 学习之基础知识篇


本文主要摘抄一些面试过程可能会遇到的一些基础知识问题，以便后续查阅复习。
<!--more-->

## Linux操作系统常用命令

1. 使用 shell 命令查看路径下的文件大小和属性
{{< admonition question "答案" false>}}
`ls -lrth`
{{< /admonition >}}
1. 使用s hell 命令找出路径下带有关键字 "test" 的 go 语言文件
{{< admonition question "答案" false>}}
`find . -name "*.go"|xargs grep "test"`
{{< /admonition >}}
1. 查看服务器的进程资源使用情况
{{< admonition question "答案" false>}}
`top`
{{< /admonition >}}
1. 使用 shell 命令查看服务监听 80 端口的进程 id
{{< admonition question "答案" false>}}
`netstat -anp|grep EST|grep 80`
{{< /admonition >}}










