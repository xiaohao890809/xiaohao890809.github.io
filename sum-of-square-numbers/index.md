# 力扣-平方数之和 

    
:link: [题目链接](https://leetcode.cn/problems/sum-of-square-numbers)

给定一个非负整数 $c$，你要判断是否存在两个整数 $a$ 和 $b$，使得 $a^2 + b^2 = c$。

{{< admonition example "示例 1：" true>}}
**输入**：c = 5<br>
**输出**：true<br>
**解释**：`1 * 1 + 2 * 2 = 5`
{{< /admonition >}}

{{< admonition example "示例 2：" true>}}
**输入**：c = 3<br>
**输出**：false
{{< /admonition >}}

**提示**：

- $0 <= c <= 2^{31} - 1$

**解题思路**

为什么双指针不会错过正确答案？双指针的本质。[^1]

看了官方题解的双指针算法，不免产生一个疑问，假设初始化时，左指针 $low = 0$，右指针 $high = sqrt(c)$。 为什么 $low^2+high^2<c$ 时，要让 `low++` 而不是 `high++` 呢？或者说为什么让 `low++` 可以保证不错过正确答案呢？ 同理，为什么 $low^2+high^2>c$ 时，要让 `high--` 而不是 `low--` 呢？或者说为什么让 `high--` 可以保证不错过正确答案呢？ 

其实我们可以把双指针的过程看成在一个矩阵中搜寻的过程。举个例子，c = 18，初始化 low = 0，high = 4，那么看如下矩阵：

{{<image src="/images/ju1.png" caption="矩阵" width="350">}}

矩阵沿主对角线对称 ($low<=high$)，其中的元素表示 $low^2+high^2$ 的值，黄色格子表示当前的 $low^2+high^2$，绿色格子表示目标 `c`，`low++` 相当于让黄色格子下移，`high--` 则相当于让黄色格子左移。这里矩阵的性质和搜索的过程其实和[搜索二维矩阵 II](https://leetcode.cn/problems/search-a-2d-matrix-ii)是一样的。每一列从上到下升序，每一行从左到右升序。 查找的过程具有如下性质：

1. 初始化时黄色格子必定在矩阵的右上角。
1. 每次比较 $low^2+high^2$ 可以排除矩阵的一行或一列。

如下图：

{{<image src="/images/ju2.png" caption="矩阵" width="700">}}

由于以上性质，当前黄色格子的上方和右边的所有元素一定是已经被排除的，所以黄色格子在搜索过程中只有两种行为：

1. 小于 ccc ：左边的元素都小于当前元素，只能下移，相当于 `low++`。**此时排除的是黄色格子以及左边同行的元素，都小于 ccc ，所以不会错过正确答案。**
1. 大于 ccc ：下面的元素都大于当前元素，只能左移，相当于 `high--`。**此时排除的是黄色格子以及下方同列的元素，都大于 ccc ，所以不会错过正确答案。**

如此一来，双指针这个操作就十分自然了。

```python
def judgeSquareSum(c: int) -> bool:
    low, high = 0, int(c**0.5)
    while low <= high:
        sumOf = low*low + high*high
        if sumOf == c: return True
        elif sumOf < c: low += 1
        else: high -= 1
    return False
```

**复杂度分析**

- 矩阵的行数和列数都是 $\sqrt{c}$，所以时间复杂度为 $O(\sqrt{c})$。

[^1]: [为什么双指针不会错过正确答案？双指针的本质。](https://leetcode.cn/problems/sum-of-square-numbers/solutions/748260/shuang-zhi-zhen-de-ben-zhi-er-wei-ju-zhe-ebn3/)












