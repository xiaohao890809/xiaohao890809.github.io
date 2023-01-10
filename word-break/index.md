# 力扣-单词拆分 

    
:link: [题目链接](https://leetcode.cn/problems/word-break)

给你一个字符串 `s` 和一个字符串列表 `wordDict` 作为字典。请你判断是否可以利用字典中出现的单词拼接出 `s`。

**注意**：不要求字典中出现的单词全部都使用，并且字典中的单词可以重复使用。

{{< admonition example "示例 1：" true>}}
**输入**：s = `"leetcode", wordDict = ["leet", "code"]`<br>
**输出**：true<br>
**解释**：返回 true 因为 `"leetcode"` 可以由 `"leet"` 和 `"code"` 拼接成。
{{< /admonition >}}

{{< admonition example "示例 2：" true>}}
**输入**：s = `"applepenapple", wordDict = ["apple", "pen"]`<br>
**输出**：true<br>
**解释**：返回 true 因为 `"applepenapple"` 可以由 `"apple" "pen" "apple"` 拼接成。注意，你可以重复使用字典中的单词。
{{< /admonition >}}

{{< admonition example "示例 3：" true>}}
**输入**：s = `"catsandog", wordDict = ["cats", "dog", "sand", "and", "cat"]`<br>
**输出**：false
{{< /admonition >}}

**提示**：

- $1 <= s.length <= 300$
- $1 <= wordDict.length <= 1000$
- $1 <= wordDict[i].length <= 20$
- `s` 和 `wordDict[i]` 仅有小写英文字母组成
- `wordDict` 中的所有字符串**互不相同**

动态规划+记忆化回溯 逐行解释 python3[^1]

## 动态规划

{{<image src="/images/word.png" caption="动态规划" width="600">}}

1. 初始化 $dp=[False,⋯,False]$，长度为 $n+1$。$n$ 为字符串长度。$dp[i]$ 表示 $s$ 的前 $i$ 位是否可以用 $wordDict$ 中的单词表示。
1. 初始化 $dp[0]=True$，空字符可以被表示。
1. 遍历字符串的所有子串，遍历开始索引 $i$，遍历区间 $[0,n)$：
    - 遍历结束索引 $j$，遍历区间 $[i+1,n+1)$：
        - 若 $dp[i]=True$ 且 $s[i,⋯,j)$ 在 $wordlistword$ 中：$dp[j]=True$。解释：$dp[i]=True$ 说明 $s$ 的前 $i$ 位可以用 $wordDict$ 表示，则 $s[i,⋯,j)$ 出现在 $wordDict$ 中，说明 $s$ 的前 $j$ 位可以表示。
1. 返回 $dp[n]$

**代码**

```python
def wordBreak(s, wordDict):
    n = len(s)
    dp = [False]*(n+1)
    dp[0] = True
    for i in range(n):
        for j in range(i+1, n+1):
            if(dp[i] and (s[i:j] in wordDict)):
                dp[j] = True
    return dp[-1]
```

**复杂度分析**

- 时间复杂度：$O(n^{2})$
- 空间复杂度：$O(n)$

[^1]: [动态规划+记忆化回溯 逐行解释 python3](https://leetcode.cn/problems/word-break/solutions/50986/dong-tai-gui-hua-ji-yi-hua-hui-su-zhu-xing-jie-shi/)


