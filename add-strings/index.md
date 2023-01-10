# 力扣-字符串相加 

    
:link: [题目链接](https://leetcode.cn/problems/add-strings)

给定两个字符串形式的非负整数 `num1` 和 `num2`，计算它们的和并同样以字符串形式返回。

你不能使用任何內建的用于处理大整数的库（比如 `BigInteger`）， 也不能直接将输入的字符串转换为整数形式。

{{< admonition example "示例 1：" true>}}
**输入**：`num1 = "11", num2 = "123"`<br>
**输出**：`"134"`
{{< /admonition >}}

{{< admonition example "示例 2：" true>}}
**输入**：`num1 = "456", num2 = "77"`<br>
**输出**：`"533"`<br>
{{< /admonition >}}

{{< admonition example "示例 3：" true>}}
**输入**：`num1 = "0", num2 = "0"`<br>
**输出**：`"0"`<br>
{{< /admonition >}}

**提示**：

- $1 <= num1.length, num2.length <= 10^4$
- `num1` 和 `num2` 都只包含数字 `0-9`
- `num1` 和 `num2` 都不包含任何前导零

## 算法流程

字符串相加 （双指针，清晰图解）[^1]

- 设定 `i`，`j` 两指针分别指向 `num1`，`num2` 尾部，模拟人工加法；
- **计算进位**： 计算 `carry = tmp // 10`，代表当前位相加是否产生进位；
- **添加当前位**： 计算 `tmp = n1 + n2 + carry`，并将当前位 `tmp % 10` 添加至 `res` 头部；
- **索引溢出处理**： 当指针 `i` 或 `j` 走过数字首部后，给 `n1`，`n2` 赋值为 0，相当于给 `num1`，`num2` 中长度较短的数字前面填 0，以便后续计算。
- 当遍历完 `num1`，`num2` 后跳出循环，并根据 `carry` 值决定是否在头部添加进位 1，最终返回 `res` 即可。

```python
def addStrings(num1: str, num2: str) -> str:
    res = ""
    i, j, carry = len(num1) - 1, len(num2) - 1, 0
    while i >= 0 or j >= 0:
        n1 = int(num1[i]) if i >= 0 else 0
        n2 = int(num2[j]) if j >= 0 else 0
        tmp = n1 + n2 + carry
        carry = tmp // 10
        res = str(tmp % 10) + res
        i, j = i - 1, j - 1
    return "1" + res if carry else res
```

**复杂度分析**

- 时间复杂度 $O(max(M,N))$：其中 $M$，$N$ 为 $2$ 数字长度，按位遍历一遍数字（以较长的数字为准）；
- 空间复杂度 $O(1)$：指针与变量使用常数大小空间。

[^1]: [字符串相加 （双指针，清晰图解）](https://leetcode.cn/problems/add-strings/solutions/12250/add-strings-shuang-zhi-zhen-fa-by-jyd/?languageTags=python%2Cpython3)













