# 力扣-查询两个字符串的最长公共子串 

    
**查询两个字符串的最长公共子串。**

- 用 Python 实现查找两个字符串 a,b 中的最长公共子串[^1]
- Python——查询两个字符串的最长公共子串[^2]

## 循环查找

思路：

1. 通过字符串1从全长开始判断是否存在于字符串2中，如果不存在则迭代至只有1位字符
1. 通过列表来保存结果，以免出现有多个同长的最长子串情况
1. 选择长度短的字符串作为操作字符串，以提升效率

```python
def getLongestSameStr(str1, str2):
    # 判断两个字符串长短，取短的那个进行操作
    if len(str1) > len(str2):
        str1, str2 = str2, str1

    f = []
    for i in range(len(str1), 0, -1):
        for j in range(len(str1) + 1 - i):
            e = str1[j:j + i]
            if e in str2:
                f.append(e)
        # 判断当前长度下，是否存在子串
        if f:
            break

    f1 = ",".join(f)
    return f1
```

[^1]: [用Python实现查找两个字符串a,b中的最长公共子串](https://blog.csdn.net/weixin_42968460/article/details/123132521/)
[^2]: [Python——查询两个字符串的最长公共子串](https://www.cnblogs.com/alunzuishuai/p/16344936.html)













