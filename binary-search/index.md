# 力扣-二分查找

    
:link: [题目链接](https://leetcode.cn/problems/binary-search)

给定一个 `n` 个元素有序的（升序）整型数组 `nums` 和一个目标值 `target`，写一个函数搜索 `nums` 中的 `target`，如果目标值存在返回下标，否则返回 `-1`。

{{< admonition example "示例 1：" true>}}
**输入**：nums = [-1,0,3,5,9,12], target = 9<br>
**输出**：4<br>
**解释**：9 出现在 nums 中并且下标为 4
{{< /admonition >}}

{{< admonition example "示例 2：" true>}}
**输入**：nums = [-1,0,3,5,9,12], target = 2<br>
**输出**：-1<br>
**解释**：2 不存在 nums 中因此返回 -1
{{< /admonition >}}

**提示**：

你可以假设 `nums` 中的所有元素是不重复的。

- $n$ 将在 $[1, 10000]$之间。
- $nums$ 的每个元素都将在 $[-9999, 9999]$ 之间。

## 二分查找

在升序数组 $nums$ 中寻找目标值 $target$，对于特定下标 $i$，比较 $nums[i]$ 和 $target$ 的大小：[^1]

- 如果 $nums[i]=target$，则下标 $i$ 即为要寻找的下标；
- 如果 $nums[i]>target$，则 $target$ 只可能在下标 $i$ 的左侧；
- 如果 $nums[i]<target$，则 $target$ 只可能在下标 $i$ 的右侧。

基于上述事实，可以在有序数组中使用二分查找寻找目标值。

二分查找的做法是，定义查找的范围 $[left,right]$，初始查找范围是整个数组。每次取查找范围的中点 $mid$，比较 $nums[mid]$ 和 $target$ 的大小，如果相等则 $mid$ 即为要寻找的下标，如果不相等则根据 $nums[mid]$ 和 $target$ 的大小关系将查找范围缩小一半。

由于每次查找都会将查找范围缩小一半，因此二分查找的时间复杂度是 $O(log⁡n)$，其中 $n$ 是数组的长度。

二分查找的条件是查找范围不为空，即 $left≤right$。如果 $target$ 在数组中，二分查找可以保证找到 $target$，返回 $target$ 在数组中的下标。如果 $target$ 不在数组中，则当 $left>right$ 时结束查找，返回 $−1$。

```python
def search(nums: list[int], target: int) -> int:
    l, r = 0, len(nums) - 1
    while l <= r:
        mid = (l + r) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            l = mid + 1
        else:
            r = mid - 1
    return -1
```

**复杂度分析**

- 时间复杂度：$O(log⁡n)$，其中 $n$ 是数组的长度。
- 空间复杂度：$O(1)$。

[^1]: [二分查找](https://leetcode.cn/problems/binary-search/solutions/980494/er-fen-cha-zhao-by-leetcode-solution-f0xw)









