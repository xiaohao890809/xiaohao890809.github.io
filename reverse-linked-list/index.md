# 力扣-反转链表

    
:link: [题目链接](https://leetcode.cn/problems/reverse-linked-list/)

给你单链表的头节点 `head`，请你反转链表，并返回反转后的链表。

{{<image src="/images/head1.jpg" caption="示例1" width="400">}}

{{< admonition example "示例 1：" true>}}
**输入**：head = [1,2,3,4,5]<br>
**输出**：[5,4,3,2,1]
{{< /admonition >}}

{{<image src="/images/head2.jpg" caption="示例2" width="150">}}

{{< admonition example "示例 2：" true>}}
**输入**：head = [1,2]<br>
**输出**：[2,1]
{{< /admonition >}}

{{< admonition example "示例 3：" true>}}
**输入**：head = []<br>
**输出**：[]
{{< /admonition >}}

**提示**：

- 链表中节点的数目范围是 $[0, 5000]$
- $-5000 <= Node.val <= 5000$ 

## 双指针迭代

我们可以申请两个指针，第一个指针叫 `pre`，最初是指向 `null` 的。[^1]

- 第二个指针 `cur` 指向 `head`，然后不断遍历 `cur`。
- 每次迭代到 `cur`，都将 `cur` 的 `next` 指向 `pre`，然后 `pre` 和 `cur` 前进一位。
- 都迭代完了(`cur` 变成 `null` 了)，`pre` 就是最后一个节点了。

动画演示如下：

{{<image src="/images/pre.gif" caption="动画演示" width="550">}}

动画演示中其实省略了一个 `tmp` 变量，这个 `tmp` 变量会将 `cur` 的下一个节点保存起来。

```python
def reverseList(head):
    """
    :type head: ListNode
    :rtype: ListNode
    """
    # 申请两个节点，pre和 cur，pre指向None
    pre = None
    cur = head
    # 遍历链表，while循环里面的内容其实可以写成一行
    # 这里只做演示，就不搞那么骚气的写法了
    while cur:
        # 记录当前节点的下一个节点
        tmp = cur.next
        # 然后将当前节点指向pre
        cur.next = pre
        # pre和cur节点都前进一位
        pre = cur
        cur = tmp
    return pre  
```

**复杂度分析**[^2]

- 时间复杂度：$O(n)$
- 空间复杂度：$O(1)$

[^1]: [动画演示+多种解法 206. 反转链表](https://leetcode.cn/problems/reverse-linked-list/solutions/36710/dong-hua-yan-shi-206-fan-zhuan-lian-biao-by-user74/)
[^2]: [[视频图解]206. 反转链表，迭代 + 递归双解法](https://leetcode.cn/problems/reverse-linked-list/solutions/762346/shi-pin-tu-jie-206-fan-zhuan-lian-biao-d-zvli)









