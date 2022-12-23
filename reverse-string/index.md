# 力扣-反转字符串

    
:link: [题目链接](https://leetcode.cn/problems/reverse-string)

编写一个函数，其作用是将输入的字符串反转过来。输入字符串以字符数组 `s` 的形式给出。

不要给另外的数组分配额外的空间，你必须**原地**修改输入数组、使用 O(1) 的额外空间解决这一问题。

{{< admonition example "示例 1：" true>}}
**输入**：s = ["h","e","l","l","o"]<br>
**输出**：["o","l","l","e","h"]
{{< /admonition >}}

{{< admonition example "示例 2：" true>}}
**输入**：s = ["H","a","n","n","a","h"]<br>
**输出**：["h","a","n","n","a","H"]
{{< /admonition >}}

**提示**：

- $1 <= s.length <= 10^5$
- $s[i]$ 都是 ASCII 码表中的可打印字符

库函数，双指针[^1]

## 迭代

```python
def reverseString(s: List[str]) -> None:
    if not s:
        return 0
    s[:] = s[::-1]
```

## 双指针

```python
def reverseString(s: list[str]) -> None:
    n = len(s)
    l, r = 0, n-1
    while l < r:
        s[l], s[r] = s[r], s[l]
        l += 1
        r -= 1
```

[^1]: [344.反转数组](https://leetcode.cn/problems/reverse-string/solutions/2023446/by-qiang-ren-suo-nan-o-uhuu/)








