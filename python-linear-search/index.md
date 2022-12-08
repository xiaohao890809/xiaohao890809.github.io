# Python 线性查找 

    
线性查找指按一定的顺序检查数组中每一个元素，直到找到所要寻找的特定值为止。[^1]

{{<image src="/images/Linear.png" caption="线性查找" width="700">}}

```python
def linearSearch(s, x):
    for i in range(len(s)):
        if s[i] == x:
            return i
    return -1
```

[^1]: [Python 线性查找](https://www.runoob.com/python3/python-linear-search.html)


