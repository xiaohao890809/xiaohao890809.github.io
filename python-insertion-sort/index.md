# Python 插入排序 

    
插入排序（英语：`Insertion Sort`）是一种简单直观的排序算法。它的工作原理是通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。[^1]

{{<image src="/images/insertionSort.gif" caption="插入排序" width="700">}}

```python
def insertionSort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and key < arr[j]:
            arr[j+1] = arr[j]
            j -= 1
        arr[j+1] = key
    return arr
```

[^1]: [Python 插入排序](https://www.runoob.com/python3/python-insertion-sort.html)


