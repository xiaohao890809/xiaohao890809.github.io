# 为什么要对数仓进行分层


根据项目中的介绍，谈谈为什么要对数仓进行分层？。
<!--more-->

{{<image src="/images/write.png" caption="写流程" width="750">}}

1. **划清层次结构**：每一个数据分层都有它的作用域，这样我们在使用表的时候能更方便地定位和理解。
1. **数据血缘追踪**：简单来讲可以这样理解，我们最终给下游是直接能使用的业务表，但是它的来源有很多，如果有一张来源表出问题了，我们希望能够快速准确地定位到问题，并清楚它的危害范围。
1. **减少重复开发**：规范数据分层，开发一些通用的中间层数据，能够减少极大的重复计算。
1. **把复杂问题简单化**：将一个复杂的任务分解成多个步骤来完成，每一层只处理单一的步骤，比较简单和容易理解。而且便于维护数据的准确性，当数据出现问题之后，可以不用修复所有的数据，只需要从有问题的步骤开始修复。
1. **屏蔽原始数据的异常**：屏蔽业务的影响，不必改一次业务就需要重新接入数据。

**参考链接**

- [腾讯微信部门大数据开发面试题-附答案](https://mp.weixin.qq.com/s/vt_8VKRH7HjEKJ-2P_H1kA)
