# Python 二分查找 

    
二分搜索是一种在有序数组中查找某一特定元素的搜索算法。[^1]

- 搜索过程从数组的中间元素开始，如果中间元素正好是要查找的元素，则搜索过程结束；
- 如果某一特定元素大于或者小于中间元素，则在数组大于或小于中间元素的那一半中查找，而且跟开始一样从中间元素开始比较。
- 如果在某一步骤数组为空，则代表找不到。
- 这种搜索算法每一次比较都使搜索**范围缩小一半**。

{{<image src="/images/Binary_search_into_array.png" caption="冒泡排序" width="400">}}

```python
def binarySearch(s, l , r, x):
    if r >= l:
        mid = (l + r) // 2
        if s[mid] == x:
            return mid
        elif s[mid] > x:
            return binarySearch(s, l, mid-1, x)
        else:
            return binarySearch(s, mid+1, r, x)
    else:
        return -1
```

[^1]: [Python 二分查找](https://www.runoob.com/python3/python-binary-search.html)


