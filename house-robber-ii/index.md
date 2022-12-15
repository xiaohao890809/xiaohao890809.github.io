# 力扣-打家劫舍 II

    
:link: [题目链接](https://leetcode.cn/problems/house-robber-ii)

你是一个专业的小偷，计划偷窃沿街的房屋，每间房内都藏有一定的现金。这个地方所有的房屋都**围成一圈**，这意味着第一个房屋和最后一个房屋是紧挨着的。同时，相邻的房屋装有相互连通的防盗系统，**如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警**。

给定一个代表每个房屋存放金额的非负整数数组，计算你**在不触动警报装置的情况下**，今晚能够偷窃到的最高金额。

{{< admonition example "示例 1：" true>}}
**输入**：nums = [2,3,2]<br>
**输出**：3<br>
**解释**：你不能先偷窃 1 号房屋（金额 = 2），然后偷窃 3 号房屋（金额 = 2）, 因为他们是相邻的。
{{< /admonition >}}

{{< admonition example "示例 2：" true>}}
**输入**：nums = [1,2,3,1]<br>
**输出**：4<br>
**解释**：你可以先偷窃 1 号房屋（金额 = 1），然后偷窃 3 号房屋（金额 = 3）。<br>
&emsp;&emsp;&emsp;偷窃到的最高金额 = 1 + 3 = 4 。
{{< /admonition >}}

{{< admonition example "示例 3：" true>}}
**输入**：nums = [1,2,3]<br>
**输出**：3
{{< /admonition >}}

**提示**：

- $1 <= nums.length <= 100$
- $0 <= nums[i] <= 1000$

## 前言

这道题是「[198. 打家劫舍](https://leetcode.cn/problems/house-robber)」的进阶，和第 198 题的不同之处是，这道题中的房屋是首尾相连的，第一间房屋和最后一间房屋相邻，因此第一间房屋和最后一间房屋不能在同一晚上偷窃。[^1]

## 动态规划

首先考虑最简单的情况。如果只有一间房屋，则偷窃该房屋，可以偷窃到最高总金额。如果只有两间房屋，则由于两间房屋相邻，不能同时偷窃，只能偷窃其中的一间房屋，因此选择其中金额较高的房屋进行偷窃，可以偷窃到最高总金额。

注意到当房屋数量不超过两间时，最多只能偷窃一间房屋，因此不需要考虑首尾相连的问题。如果房屋数量大于两间，就必须考虑首尾相连的问题，第一间房屋和最后一间房屋不能同时偷窃。

如何才能保证第一间房屋和最后一间房屋不同时偷窃呢？

- 如果偷窃了第一间房屋，则不能偷窃最后一间房屋，因此偷窃房屋的范围是第一间房屋到最后第二间房屋；
- 如果偷窃了最后一间房屋，则不能偷窃第一间房屋，因此偷窃房屋的范围是第二间房屋到最后一间房屋。

假设数组 $nums$ 的长度为 $n$。如果不偷窃最后一间房屋，则偷窃房屋的下标范围是 $[0,n−2]$；如果不偷窃第一间房屋，则偷窃房屋的下标范围是 $[1,n−1]$。在确定偷窃房屋的下标范围之后，即可用第 198 题的方法解决。对于两段下标范围分别计算可以偷窃到的最高总金额，其中的最大值即为在 $n$ 间房屋中可以偷窃到的最高总金额。

假设偷窃房屋的下标范围是 $[start,end]$，用 $dp[i]$ 表示在下标范围 $[start,i]$ 内可以偷窃到的最高总金额，那么就有如下的状态转移方程：

$$dp[i]=max(dp[i−2]+nums[i],dp[i−1])$$

边界条件为：

$$ 
\begin{cases} 
{dp}[{start}] = {nums}[{start}] & 只有一间房屋，则偷窃该房屋 \\\\ 
{dp}[{start}+1] = max({nums}[{start}], {nums}[{start}+1]) & 只有两间房屋，偷窃其中金额较高的房屋 
\end{cases}
$$

计算得到 $dp[end]$ 即为下标范围 $[start,end]$ 内可以偷窃到的最高总金额。

分别取 $(start,end)=(0,n−2)$ 和 $(start,end)=(1,n−1)$ 进行计算，取两个 $dp[end]$ 中的最大值，即可得到最终结果。

根据上述思路，可以得到时间复杂度 $O(n)$ 和空间复杂度 $O(n)$ 的实现。考虑到每间房屋的最高总金额只和该房屋的前两间房屋的最高总金额相关，因此可以使用滚动数组，在每个时刻只需要存储前两间房屋的最高总金额，将空间复杂度降到 $O(1)$。

```python
def rob(nums: list[int]) -> int:

    def robRange(start: int, end: int) -> int:
        first = nums[start]
        second = max(nums[start], nums[start + 1])
        for i in range(start + 2, end + 1):
            first, second = second, max(first + nums[i], second)
        return second

    length = len(nums)
    if length == 1:
        return nums[0]
    elif length == 2:
        return max(nums[0], nums[1])
    else:
        return max(robRange(0, length - 2), robRange(1, length - 1))
```

**复杂度分析**

- 时间复杂度：$O(n)$，其中 $n$ 是数组长度。需要对数组遍历两次，计算可以偷窃到的最高总金额。
- 空间复杂度：$O(1)$。

[^1]: [打家劫舍 II](https://leetcode.cn/problems/house-robber-ii/solutions/722767/da-jia-jie-she-ii-by-leetcode-solution-bwja/)









