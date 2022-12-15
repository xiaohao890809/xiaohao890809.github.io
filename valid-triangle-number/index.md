# 力扣-有效三角形的个数 

    
:link: [题目链接](https://leetcode.cn/problems/valid-triangle-number)

给定一个包含非负整数的数组 `nums`，返回其中可以组成三角形三条边的三元组个数。

{{< admonition example "示例 1：" true>}}
**输入**：nums = [2,2,3,4]<br>
**输出**：3<br>
**解释**：有效的组合是: <br>
2,3,4 (使用第一个 2)<br>
2,3,4 (使用第二个 2)<br>
2,2,3
{{< /admonition >}}

{{< admonition example "示例 2：" true>}}
**输入**：nums = [4,2,3,4]<br>
**输出**：4
{{< /admonition >}}

**提示**：

- $1 <= nums.length <= 1000$
- $0 <= nums[i] <= 1000$

## 暴力求解法

```python
class Solution:

    def is_triangle(self, a, b ,c):
        if a + b > c and abs(a - b) < c: return True 
        elif a + c > b and abs(a - c) < b: return True 
        else: return False

    def triangleNumber(self, nums: List[int]) -> int:
        n = len(nums)
        ret_list = []
        for i in range(n-2):
            for j in range(i+1, n):
                for k in range(j+1, n):
                    ret = self.is_triangle(nums[i], nums[j], nums[k])
                    ret_list.append(ret)
        triangle_list = [item for item in ret_list if item is True]
        return len(triangle_list)
```

结果会**超出时间限制**

## 排序 + 二分查找

**思路与算法**[^1]

对于正整数 $a,b,c$，它们可以作为三角形的三条边，当且仅当：

$$
\begin{cases}
  a+b>c \\\\
  a+c>b \\\\ 
  b+c>a
\end{cases}
$$

均成立。如果我们将三条边进行升序排序，使它们满足 $a≤b≤c$，那么 $a+c>b$ 和 $b+c>a$ 使一定成立的，我们只需要保证 $a+b>c$。

因此，我们可以将数组 $nums$ 进行升序排序，随后使用二重循环枚举 $a$ 和 $b$。设 $a=nums[i],b=nums[j]$，为了防止重复统计答案，我们需要保证 $i<j$。剩余的边 $c$ 需要满足 $c<nums[i]+nums[j]$，我们可以在 $[j+1,n−1]$ 的下标范围内使用二分查找（其中 $n$ 是数组 $nums$ 的长度），找出最大的满足 $nums[k]<nums[i]+nums[j]$ 的下标 $k$，这样一来，在 $[j+1,k]$ 范围内的下标都可以作为边 $c$ 的下标，我们将该范围的长度 $k−j$ 累加入答案。

当枚举完成后，我们返回累加的答案即可。

**细节**

注意到题目描述中 $nums$ 包含的元素为**非负整数**，即除了正整数以外，$nums$ 还会包含 $0$。但如果我们将 $nums$ 进行升序排序，那么在枚举 $a$ 和 $b$ 时出现了 $0$，那么 $nums[i]$ 一定为 $0$。此时，边 $c$ 需要满足 $c<nums[i]+nums[j]=nums[j]$，而下标在 $[j+1,n−1]$ 范围内的元素一定都是大于等于 $nums[j]$ 的，因此二分查找会失败。若二分查找失败，我们可以令 $k=j$，此时对应的范围长度 $k−j=0$，我们也就保证了答案的正确性。

```python
def triangleNumber(nums: List[int]) -> int:
    n = len(nums)
    nums.sort()
    ans = 0
    for i in range(n):
        for j in range(i + 1, n):
            left, right, k = j + 1, n - 1, j
            while left <= right:
                mid = (left + right) // 2
                if nums[mid] < nums[i] + nums[j]:
                    k = mid
                    left = mid + 1
                else:
                    right = mid - 1
            ans += k - j
    return ans
```

**复杂度分析**

- 时间复杂度：$O(n^{2}log⁡n)$，其中 $n$ 是数组 $nums$ 的长度。我们需要 $O(nlog⁡n)$ 的时间对数组 $nums$ 进行排序，随后需要 $O(n^{2}log⁡n)$ 的时间使用二重循环枚举 $a,b$ 的下标以及使用二分查找得到 $c$ 的下标范围。
- 空间复杂度：$O(log⁡n)$，即为排序需要的栈空间。

[^1]: [有效三角形的个数](https://leetcode.cn/problems/valid-triangle-number/solutions/914061/you-xiao-san-jiao-xing-de-ge-shu-by-leet-t2td)












