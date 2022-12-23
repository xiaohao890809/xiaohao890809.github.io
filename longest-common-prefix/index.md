# 力扣-最长公共前缀

    
:link: [题目链接](https://leetcode.cn/problems/longest-common-prefix)

编写一个函数来查找字符串数组中的最长公共前缀。

如果不存在公共前缀，返回空字符串 `""`。

{{< admonition example "示例 1：" true>}}
**输入**：strs = ["flower","flow","flight"]<br>
**输出**："fl"
{{< /admonition >}}

{{< admonition example "示例 2：" true>}}
**输入**：strs = ["dog","racecar","car"]<br>
**输出**：""<br>
**解释**：输入不存在公共前缀。
{{< /admonition >}}

**提示**：

- $1 <= strs.length <= 200$
- $0 <= strs[i].length <= 200$
- `strs[i]` 仅由小写英文字母组成

## 横向扫描

用 $LCP(S_{1}…S_{n})$ 表示字符串 $S_{1}…S_{n}$ 的最长公共前缀。[^1]

可以得到以下结论：

$$LCP(S_1…Sn)=LCP(LCP(LCP(S_1,S_2),S_3),…S_n)$$

基于该结论，可以得到一种查找字符串数组中的最长公共前缀的简单方法。依次遍历字符串数组中的每个字符串，对于每个遍历到的字符串，更新最长公共前缀，当遍历完所有的字符串以后，即可得到字符串数组中的最长公共前缀。

{{<image src="/images/heng.png" caption="横向扫描" width="800">}}

如果在尚未遍历完所有的字符串时，最长公共前缀已经是空串，则最长公共前缀一定是空串，因此不需要继续遍历剩下的字符串，直接返回空串即可。

```python
class Solution:
    def longestCommonPrefix(self, strs: List[str]) -> str:
        if not strs:
            return ""
        
        prefix, count = strs[0], len(strs)
        for i in range(1, count):
            prefix = self.lcp(prefix, strs[i])
            if not prefix:
                break
        
        return prefix

    def lcp(self, str1, str2):
        length, index = min(len(str1), len(str2)), 0
        while index < length and str1[index] == str2[index]:
            index += 1
        return str1[:index]
```

**复杂度分析**

- 时间复杂度：$O(mn)$，其中 $m$ 是字符串数组中的字符串的平均长度，$n$ 是字符串的数量。最坏情况下，字符串数组中的每个字符串的每个字符都会被比较一次。
- 空间复杂度：$O(1)$。使用的额外空间复杂度为常数。

## 纵向扫描

方法一是横向扫描，依次遍历每个字符串，更新最长公共前缀。另一种方法是纵向扫描。纵向扫描时，从前往后遍历所有字符串的每一列，比较相同列上的字符是否相同，如果相同则继续对下一列进行比较，如果不相同则当前列不再属于公共前缀，当前列之前的部分为最长公共前缀。

{{<image src="/images/zong.png" caption="纵向扫描" width="700">}}

```python
def longestCommonPrefix(strs: list[str]) -> str:
    if not strs:
        return ""

    length, count = len(strs[0]), len(strs)
    for i in range(length):
        c = strs[0][i]
        if any(i == len(strs[j]) or strs[j][i] != c for j in range(1, count)):
            return strs[0][:i]

    return strs[0]
```

**复杂度分析**

- 时间复杂度：$O(mn)$，其中 $m$ 是字符串数组中的字符串的平均长度，$n$ 是字符串的数量。最坏情况下，字符串数组中的每个字符串的每个字符都会被比较一次。
- 空间复杂度：$O(1)$。使用的额外空间复杂度为常数。

[^1]: [最长公共前缀](https://leetcode.cn/problems/longest-common-prefix/solutions/288575/zui-chang-gong-gong-qian-zhui-by-leetcode-solution/)
















