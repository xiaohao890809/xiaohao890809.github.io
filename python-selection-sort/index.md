# Python 选择排序 

    
选择排序（`Selection sort`）是一种简单直观的排序算法。它的工作原理如下。[^1]

- 首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置，
- 然后，再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。
- 以此类推，直到所有元素均排序完毕。

{{<image src="/images/selectionSort.gif" caption="选择排序" width="700">}}

```python
def selectionSort(s):
    n = len(s)
    for i in range(n):
        min_idx = i
        for j in range(i+1, n):
            if s[j] < s[min_idx]:
                min_idx = j
        s[i], s[min_idx] = s[min_idx], s[i]
    return s
```

[^1]: [Python 选择排序](https://www.runoob.com/python3/python-selection-sort.html)


