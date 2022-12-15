# 力扣-爬楼梯

    
:link: [题目链接](https://leetcode.cn/problems/climbing-stairs)

假设你正在爬楼梯。需要 `n` 阶你才能到达楼顶。

每次你可以爬 `1` 或 `2` 个台阶。你有多少种不同的方法可以爬到楼顶呢？

{{< admonition example "示例 1：" true>}}
**输入**：n = 2<br>
**输出**：2<br>
**解释**：有两种方法可以爬到楼顶。<br>
&emsp;&emsp;&emsp;1. 1 阶 + 1 阶<br>
&emsp;&emsp;&emsp;2. 2 阶
{{< /admonition >}}

{{< admonition example "示例 2：" true>}}
**输入**：n = 3<br>
**输出**：3<br>
**解释**：有三种方法可以爬到楼顶。<br>
&emsp;&emsp;&emsp;1. 1 阶 + 1 阶 + 1 阶<br>
&emsp;&emsp;&emsp;2. 1 阶 + 2 阶<br>
&emsp;&emsp;&emsp;3. 2 阶 + 1 阶
{{< /admonition >}}

**提示**：

- $1 <= n <= 45$

**解题思路**

$n>2$ 时，第 $n$ 层为 $(n-1)$ 与 $(n-2)$ 层之和[^1]

**代码**

```python
def climbStairs(n: int) -> int:

    if n <= 2:
        return n

    dp = [0] * n
    dp[0] = 1
    dp[1] = 2

    for i in range(2, n):
        dp[i] = dp[i-2] + dp[i-1]

    return dp[-1]
```

[^1]: [爬楼梯](https://leetcode.cn/problems/climbing-stairs/solutions/2004541/by-wang-chen-sw-tt41)









