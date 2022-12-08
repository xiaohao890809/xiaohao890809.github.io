# Python 冒泡排序 

    
冒泡排序（`Bubble Sort`）也是一种简单直观的排序算法。[^1]

- 它重复地走访过要排序的数列，一次比较两个元素，如果他们的顺序错误就把他们交换过来。
- 走访数列的工作是重复地进行直到没有再需要交换，也就是说该数列已经排序完成。
- 这个算法的名字由来是因为越小的元素会经由交换慢慢“浮”到数列的顶端。

{{<image src="/images/bubbleSort.gif" caption="冒泡排序" width="700">}}

```python
def bubbleSort(s):
    n = len(s)
    for i in range(n):
        for j in range(n-i-1):
            if s[j+1] < s[j]:
                s[j+1], s[j] = s[j], s[j+1]
    return s
```

[^1]: [Python 冒泡排序](https://www.runoob.com/python3/python-bubble-sort.html)


