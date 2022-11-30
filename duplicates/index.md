# 力扣-数组中重复的数据

    
:link: [题目链接](https://leetcode.cn/problems/find-all-duplicates-in-an-array)

给你一个长度为 `n` 的整数数组 `nums` ，其中 `nums` 的所有整数都在范围 `[1, n]` 内，且每个整数出现**一次**或**两次**。请你找出所有出现**两次**的整数，并以数组形式返回。

你必须设计并实现一个时间复杂度为 `O(n)` 且仅使用常量额外空间的算法解决此问题。

{{< admonition example "示例 1：" true>}}
**输入**：nums = [4,3,2,7,8,2,3,1]<br>
**输出**：[2,3]
{{< /admonition >}}

{{< admonition example "示例 2：" true>}}
**输入**：nums = [1,1,2]<br>
**输出**：[1]
{{< /admonition >}}

{{< admonition example "示例 3：" true>}}
**输入**：nums = [1]<br>
**输出**：[]
{{< /admonition >}}

## 方法一：将元素交换到对应的位置

> 思路与算法

由于给定的 $n$ 个数都在 $[1,n]$ 的范围内，如果有数字出现了两次，就意味着 $[1,n]$ 中有数字没有出现过。

因此，我们可以尝试将每一个数放在对应的位置。由于数组的下标范围是 $[0,n−1]$，我们需要将数 $i$ 放在数组中下标为 $i−1$ 的位置：

- 如果 $i$ 恰好出现了一次，那么将 $i$ 放在数组中下标为 $i−1$ 的位置即可；
- 如果 $i$ 出现了两次，那么我们希望其中的一个 $i$ 放在数组下标中为 $i−1$ 的位置，另一个 $i$ 放置在任意「不冲突」的位置 $j$。也就是说，数 $j+1$ 没有在数组中出现过。

这样一来，如果我们按照上述的规则放置每一个数，那么我们只需要对数组进行一次遍历。当遍历到位置 $i$ 时，如果 $nums[i]−1 \neq i$，说明 $nums[i]$ 出现了两次（另一次出现在位置 $num[i]−1$），我们就可以将 $num[i]$ 放入答案。

放置的方法也很直观：我们对数组进行一次遍历。当遍历到位置 $i$ 时，我们知道 $nums[i]$ 应该被放在位置 $nums[i]−1$。因此我们交换 $num[i]$ 和 $nums[nums[i]−1]$ 即可，直到待交换的两个元素相等为止。

**代码**

```python
def findDuplicates(nums: List[int]) -> List[int]:
    for i in range(len(nums)):
        while nums[i] != nums[nums[i] - 1]:
            nums[nums[i] - 1], nums[i] = nums[i], nums[nums[i] - 1]
    return [num for i, num in enumerate(nums) if num - 1 != i]
```

**复杂度分析**

- 时间复杂度：$O(n)$。每一次交换操作会使得至少一个元素被交换到对应的正确位置，因此交换的次数为 $O(n)$，总时间复杂度为 $O(n)$。
- 空间复杂度：$O(1)$。返回值不计入空间复杂度。

## 方法二：使用正负号作为标记

**思路与算法**

我们也可以给 $nums[i]$ 加上「负号」表示数 $i+1$ 已经出现过一次。具体地，我们首先对数组进行一次遍历。当遍历到位置 $i$ 时，我们考虑 $nums[nums[i]−1]$ 的正负性：

- 如果 $nums[nums[i]−1]$ 是正数，说明 $nums[i]$ 还没有出现过，我们将 $nums[nums[i]−1]$ 加上负号；
- 如果 $nums[nums[i]−1]$ 是负数，说明 $nums[i]$ 已经出现过一次，我们将 $nums[i]$ 放入答案。

{{< admonition tip "细节" true>}}
由于 $nums[i]$ 本身可能已经为负数，因此在将 $nums[i]$ 作为下标或者放入答案时，需要取绝对值。
{{< /admonition >}}

**代码**

```python
def findDuplicates(nums: List[int]) -> List[int]:
    ans = []
    for x in nums:
        x = abs(x)
        if nums[x - 1] > 0:
            nums[x - 1] = -nums[x - 1]
        else:
            ans.append(x)
    return ans
```

**复杂度分析**

- 时间复杂度：$O(n)$。我们只需要对数组 $nums$ 进行一次遍历。
- 空间复杂度：$O(1)$。返回值不计入空间复杂度。


















