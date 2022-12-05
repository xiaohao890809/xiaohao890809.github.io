# 力扣-最长回文子串 

    
:link: [题目链接](https://leetcode.cn/problems/longest-palindromic-substring)

给你一个字符串 `s`，找到 `s` 中最长的回文子串。

{{< admonition example "示例 1：" true>}}
**输入**：s = "babad"<br>
**输出**："bab"<br>
**解释**："aba" 同样是符合题意的答案。
{{< /admonition >}}

{{< admonition example "示例 2：" true>}}
**输入**：s = "cbbd"<br>
**输出**"bb"<br>
{{< /admonition >}}

**提示**：

- $1 <= s.length <= 1000$
- `s` 仅由数字和英文字母组成

## 思路一 

从中心向两端扩散的双指针[^1]

如果回文串的长度为奇数，则它有一个中心字符；如果回文串的长度为偶数，则可以认为它有两个中心字符。

那么可以事先写一个函数，在 s 中寻找以 `s[l]` 和 `s[r]` 为中心的最长回文串（即 `s[l]==s[r]`，然后在不越界的前提下左移 `l`，右移 `r`），这样，如果输入相同的 `l` 和 `r`，就相当于寻找长度为奇数的回文串，如果输入相邻的 `l` 和 `r`，则相当于寻找长度为偶数的回文串：

```python
def palindrome(s, l, r):
    # 防止索引越界
    while l >= 0 and r < len(s) and s[l] == s[r]:
        # 双指针，向两边展开，左往左，右往右
        l -= 1
        r += 1
    # 返回以 s[l] 和 s[r] 为中心的最长回文串
    return s[l+1: r] # 结束循环时l比回文串的内容多左移了一个 r多右移了一个
```

那么求最长回文串，就相当于是：

```python
for i in range(len(s)):
    找到以 s[i] 为中心的回文串
    找到以 s[i]和s[i+1] 为中心的回文串
    更新答案
```

代码：

```python
def longestPalindrome(s: str) -> str:
    def palindrome(s, l, r):
        while l >= 0 and r < len(s) and s[l] == s[r]:
            l -= 1
            r += 1
        return s[l+1:r]
    
    res = ''
    for i in range(len(s)):
        sub1 = palindrome(s, i, i)
        sub2 = palindrome(s, i, i+1)
        res = sub1 if len(sub1) > len(res) else res
        res = sub2 if len(sub2) > len(res) else res
    return res
```

[^1]: [从中心向两端扩散的双指针](https://leetcode.cn/problems/longest-palindromic-substring/solutions/1490036/huan-huan-by-huan-huan-20-s8qb/)








