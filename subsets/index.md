# 力扣-子集

    
:link: [题目链接](https://leetcode.cn/problems/subsets)

给你一个整数数组 `nums`，数组中的元素**互不相同**。返回该数组所有可能的子集（幂集）。

解集**不能**包含重复的子集。你可以按**任意顺序**返回解集。

{{< admonition example "示例 1：" true>}}
**输入**：nums = [1,2,3]<br>
**输出**：[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
{{< /admonition >}}

{{< admonition example "示例 2：" true>}}
**输入**：nums = [0]<br>
**输出**：[[],[0]]
{{< /admonition >}}

**提示**：

- $1 <= nums.length <= 10$
- $-10 <= nums[i] <= 10$
- $nums$ 中的所有元素**互不相同**

几种方法[^1]

## 迭代

```python
def subsets(nums: list[int]) -> list[list[int]]:
    res = [[]]
    for i in nums:
        res = res + [[i] + num for num in res]
    return res
```

回溯三部曲[^2]

[^1]: [回溯算法](https://leetcode.cn/problems/subsets/solutions/6899/hui-su-suan-fa-by-powcai-5)
[^2]: [「代码随想录」带你学透回溯算法！78. 子集](https://leetcode.cn/problems/subsets/solutions/850474/dai-ma-sui-xiang-lu-78-zi-ji-hui-su-sou-6yfk6/)








