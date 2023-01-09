# 力扣-反转字符串中的单词

    
:link: [题目链接](https://leetcode.cn/problems/reverse-words-in-a-string)

给你一个字符串 `s`，请你反转字符串中**单词**的顺序。

**单词**是由非空格字符组成的字符串。`s`中使用至少一个空格将字符串中的**单词**分隔开。

返回**单词**顺序颠倒且**单词**之间用单个空格连接的结果字符串。

**注意**：输入字符串 `s` 中可能会存在前导空格、尾随空格或者单词间的多个空格。返回的结果字符串中，单词间应当仅用单个空格分隔，且不包含任何额外的空格。

{{< admonition example "示例 1：" true>}}
**输入**：s = "the sky is blue"<br>
**输出**："blue is sky the"
{{< /admonition >}}

{{< admonition example "示例 2：" true>}}
**输入**：s = "  hello world  "<br>
**输出**"world hello"<br>
**解释**：反转后的字符串中不能存在前导空格和尾随空格。
{{< /admonition >}}

{{< admonition example "示例 3：" true>}}
**输入**：s = "a good   example"<br>
**输出**："example good a"<br>
**解释**：如果两个单词间有多余的空格，反转后的字符串需要将单词间的空格减少到仅有一个。
{{< /admonition >}}

**提示**：

- $1 <= s.length <= 10^4$
- `s` 包含英文大小写字母、数字和空格 `' '`
- `s` 中**至少存在一个**单词

## 使用语言特性

**思路和算法**

很多语言对字符串提供了 [split]^(拆分)，[reverse]^(翻转) 和 [join]^(连接) 等方法，因此我们可以简单的调用内置的 API 完成操作：[^1]

1. 使用 `split` 将字符串按空格分割成字符串数组；
1. 使用 `reverse` 将字符串数组进行反转；
1. 使用 `join` 方法将字符串数组拼成一个字符串。

{{<image src="/images/split.png" caption="split" width="700">}}

```python
def reverseWords(s: str) -> str:
    return " ".join(reversed(s.split()))
```

**复杂度分析**

- 时间复杂度：$O(n)$，其中 $n$ 为输入字符串的长度。
- 空间复杂度：$O(n)$，用来存储字符串分割之后的结果。

[^1]: [翻转字符串里的单词](https://leetcode.cn/problems/reverse-words-in-a-string/solutions/194450/fan-zhuan-zi-fu-chuan-li-de-dan-ci-by-leetcode-sol/)
















