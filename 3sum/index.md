# 力扣-三数之和

    
:link: [题目链接](https://leetcode.cn/problems/3sum)

给你一个整数数组 $nums$，判断是否存在三元组 $[nums[i], nums[j], nums[k]]$ 满足 $i != j、i != k 且 j != k$，同时还满足 $nums[i] + nums[j] + nums[k] == 0$。

请你返回所有和为 `0` 且不重复的三元组。

**注意**：答案中不可以包含重复的三元组。

{{< admonition example "示例 1：" true>}}
**输入**：nums = [-1,0,1,2,-1,-4]<br>
**输出**：[[-1,-1,2],[-1,0,1]]<br>
**解释**：nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0 。<br>
&emsp;&emsp;&emsp;nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0 。<br>
&emsp;&emsp;&emsp;nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0 。<br>
&emsp;&emsp;&emsp;不同的三元组是 [-1,0,1] 和 [-1,-1,2] 。<br>
&emsp;&emsp;&emsp;注意，输出的顺序和三元组的顺序并不重要。
{{< /admonition >}}

{{< admonition example "示例 2：" true>}}
**输入**：nums = [0,1,1]<br>
**输出**：[]<br>
**解释**：唯一可能的三元组和不为 0 。
{{< /admonition >}}

{{< admonition example "示例 3：" true>}}
**输入**：nums = [0,0,0]<br>
**输出**：[[0,0,0]]<br>
**解释**：唯一可能的三元组和为 0 。
{{< /admonition >}}

**提示**：

- $3 <= nums.length <= 3000$
- $-10^5 <= nums[i] <= 10^5$

## 排序 + 双指针

本题的难点在于如何去除重复解。[^1]

**算法流程**：

1. 特判，对于数组长度 $n$，如果数组为 $null$ 或者数组长度小于 $3$，返回 []。
1. 对数组进行排序。
1. 遍历排序后数组：
    - 若 $nums[i]>0：$因为已经排序好，所以后面不可能有三个数加和等于 $0$，直接返回结果。
    - 对于重复元素：跳过，避免出现重复解
    - 令左指针 $L=i+1$，右指针 $R=n−1$，当 $L<R$ 时，执行循环：
        - 当 $nums[i]+nums[L]+nums[R]==0$，执行循环，判断左界和右界是否和下一位置重复，去除重复解。并同时将 $L,R$ 移到下一位置，寻找新的解
        - 若和大于 $0$，说明 $nums[R]$ 太大，$R$ 左移
        - 若和小于 $0$，说明 $nums[L]$ 太小，$L$ 右移

```python
def threeSum(nums: List[int]) -> List[List[int]]:
    
    n = len(nums)
    res = []
    if(not nums or n<3):
        return []
    nums.sort()
    res = []
    for i in range(n):
        if(nums[i] > 0):
            return res
        if(i > 0 and nums[i] == nums[i-1]):
            continue
        L = i + 1
        R = n - 1
        while(L < R):
            if(nums[i] + nums[L] + nums[R] == 0):
                res.append([nums[i], nums[L], nums[R]])
                while(L < R and nums[L] == nums[L+1]):
                    L = L + 1
                while(L < R and nums[R] == nums[R-1]):
                    R = R-1
                L = L + 1
                R = R - 1
            elif(nums[i] + nums[L] + nums[R] > 0):
                R = R - 1
            else:
                L = L + 1
    return res
```

**复杂度分析**

- 时间复杂度：$O(n^2)$，数组排序 $O(Nlog⁡N)$，遍历数组 $O(n)$，双指针遍历 $O(n)$，总体 $O(Nlog⁡N)+O(n)∗O(n)，O(n^2)$
- 空间复杂度：$O(1)$

[^1]: [排序 + 双指针，逐行解释](https://leetcode.cn/problems/3sum/solutions/39722/pai-xu-shuang-zhi-zhen-zhu-xing-jie-shi-python3-by)
















