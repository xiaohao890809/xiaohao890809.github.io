# 力扣-打家劫舍

    
:link: [题目链接](https://leetcode.cn/problems/house-robber)

你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，**如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警**。

给定一个代表每个房屋存放金额的非负整数数组，计算你**不触动警报装置的情况下**，一夜之内能够偷窃到的最高金额。

{{< admonition example "示例 1：" true>}}
**输入**：[1,2,3,1]<br>
**输出**：4<br>
**解释**：偷窃 1 号房屋 (金额 = 1) ，然后偷窃 3 号房屋 (金额 = 3)。<br>
&emsp;&emsp;&emsp;偷窃到的最高金额 = 1 + 3 = 4 。
{{< /admonition >}}

{{< admonition example "示例 2：" true>}}
**输入**：[2,7,9,3,1]<br>
**输出**：12<br>
**解释**：偷窃 1 号房屋 (金额 = 2), 偷窃 3 号房屋 (金额 = 9)，接着偷窃 5 号房屋 (金额 = 1)。<br>
&emsp;&emsp;&emsp;偷窃到的最高金额 = 2 + 9 + 1 = 12 。
{{< /admonition >}}

**提示**：

- $1 <= nums.length <= 100$
- $0 <= nums[i] <= 400$

## 动态规划

首先考虑最简单的情况。如果只有一间房屋，则偷窃该房屋，可以偷窃到最高总金额。如果只有两间房屋，则由于两间房屋相邻，不能同时偷窃，只能偷窃其中的一间房屋，因此选择其中金额较高的房屋进行偷窃，可以偷窃到最高总金额。[^1]

如果房屋数量大于两间，应该如何计算能够偷窃到的最高总金额呢？对于第 $k~(k>2)$ 间房屋，有两个选项：

1. 偷窃第 $k$ 间房屋，那么就不能偷窃第 $k−1$ 间房屋，偷窃总金额为前 $k−2$ 间房屋的最高总金额与第 $k$ 间房屋的金额之和。
1. 不偷窃第 $k$ 间房屋，偷窃总金额为前 $k−1$ 间房屋的最高总金额。

在两个选项中选择偷窃总金额较大的选项，该选项对应的偷窃总金额即为前 $k$ 间房屋能偷窃到的最高总金额。

用 $dp[i]$ 表示前 $i$ 间房屋能偷窃到的最高总金额，那么就有如下的状态转移方程：

$$dp[i]=max⁡(dp[i−2]+nums[i],dp[i−1])$$ 

边界条件为：

$$ 
\begin{cases} 
{dp}[0] = {nums}[0] & 只有一间房屋，则偷窃该房屋 \\\\ 
{dp}[1] = \max({nums}[0], {nums}[1]) & 只有两间房屋，选择其中金额较高的房屋进行偷窃 
\end{cases}
$$
 
最终的答案即为 $dp[n−1]$，其中 $n$ 是数组的长度。

```python
def rob(nums: list[int]) -> int:
    n = len(nums)

    if n == 1:
        return nums[0]

    dp = [0]*n
    dp[0] = nums[0]
    dp[1] = max(nums[0], nums[1])

    for i in range(2, n):
        dp[i] = max(dp[i-2] + nums[i], dp[i-1])

    return dp[n-1]
```

上述方法使用了数组存储结果。考虑到每间房屋的最高总金额只和该房屋的前两间房屋的最高总金额相关，因此可以使用滚动数组，在每个时刻只需要存储前两间房屋的最高总金额。

```python
def rob(nums: list[int]) -> int:
    if not nums:
        return 0

    size = len(nums)
    if size == 1:
        return nums[0]
    
    first, second = nums[0], max(nums[0], nums[1])
    for i in range(2, size):
        first, second = second, max(first + nums[i], second)
    
    return second
```

**复杂度分析**

- 时间复杂度：$O(n)$，其中 $n$ 是数组长度。只需要对数组遍历一次。
- 空间复杂度：$O(1)$。使用滚动数组，可以只存储前两间房屋的最高总金额，而不需要存储整个数组的结果，因此空间复杂度是 $O(1)$。

[^1]: [打家劫舍](https://leetcode.cn/problems/house-robber/solutions/263856/da-jia-jie-she-by-leetcode-solution/)









