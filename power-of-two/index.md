# 力扣-2 的幂

    
:link: [题目链接](https://leetcode.cn/problems/power-of-two)

给你一个整数 `n`，请你判断该整数是否是 2 的幂次方。如果是，返回 `true`；否则，返回 `false`。

如果存在一个整数 $x$ 使得 $n == 2^x$ ，则认为 $n$ 是 $2$ 的幂次方。

{{< admonition example "示例 1：" true>}}
**输入**：n = 1<br>
**输出**：true<br>
**解释**：$2^0 = 1$
{{< /admonition >}}

{{< admonition example "示例 2：" true>}}
**输入**：n = 16<br>
**输出**：true<br>
**解释**：$2^4 = 16$
{{< /admonition >}}

{{< admonition example "示例 3：" true>}}
**输入**：n = 3<br>
**输出**：false
{{< /admonition >}}

{{< admonition example "示例 4：" true>}}
**输入**：n = 4<br>
**输出**：true<br>
**解释**：$2^2 = 4$
{{< /admonition >}}

{{< admonition example "示例 5：" true>}}
**输入**：n = 5<br>
**输出**：false
{{< /admonition >}}

**提示**：

- $-2^{31} <= n <= 2^{31} - 1$

## 二进制表示

**思路和算法**

一个数 $n$ 是 $2$ 的幂，当且仅当 $n$ 是正整数，并且 $n$ 的二进制表示中仅包含 $1$ 个 $1$。[^1]

```python
def isPowerOfTwo(n: int) -> bool:
    return n > 0 and (n & (n - 1)) == 0
```

**复杂度分析**

- 时间复杂度：$O(1)$。
- 空间复杂度：$O(1)$。

[^1]: [2的幂](https://leetcode.cn/problems/power-of-two/solutions/796201/2de-mi-by-leetcode-solution-rny3/)
















