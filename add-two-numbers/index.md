# 力扣-两数相加

    
:link: [题目链接](https://leetcode.cn/problems/add-two-numbers)

给你两个**非空**的链表，表示两个非负的整数。它们每位数字都是按照**逆序**的方式存储的，并且每个节点只能存储**一位**数字。

请你将两个数相加，并以相同形式返回一个表示和的链表。

你可以假设除了数字 0 之外，这两个数都不会以 0 开头。

{{<image src="/images/add.jpg" caption="示例1" width="400">}}

{{< admonition example "示例 1：" true>}}
**输入**：l1 = [2,4,3], l2 = [5,6,4]<br>
**输出**：[7,0,8]<br>
**解释**：342 + 465 = 807.
{{< /admonition >}}

{{< admonition example "示例 2：" true>}}
**输入**：l1 = [0], l2 = [0]<br>
**输出**：[0]
{{< /admonition >}}

{{< admonition example "示例 3：" true>}}
**输入**：l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]<br>
**输出**：[8,9,9,9,0,0,0,1]
{{< /admonition >}}

**提示**：

- 每个链表中的节点数在范围 $[1, 100]$ 内
- $0 <= Node.val <= 9$ 
- 题目数据保证列表表示的数字不含前导零

**整体思路**

依次遍历 `L1` 跟 `L2` 链表相加，相当于是个位十位百位依次相加 如： $L1 = [1,4,2], L2 = [4,6,5]$[^1]

可看成：$241 + 564 = 805$

结果为：$[8,0,5]$

{{<image src="/images/twoadd.png" caption="加法" width="300">}}

我们将每位数相加后除以 `10` 的余数记为 `val`，我们将每位数相加后除以 `10` 的商记为 `tmp`

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        # 初始化链表
        head = tree = ListNode()

        val = tmp = 0
        # 当三者有一个不为空时继续循环
        while tmp or l1 or l2:
            val = tmp
            if l1:
                val = l1.val + val
                l1 = l1.next
            if l2:
                val = l2.val + val
                l2 = l2.next

            tmp = val // 10
            val = val % 10

            # 实现链表的连接
            tree.next = ListNode(val)
            tree = tree.next

        return head.next
```

[^1]: [两数相加python实现](https://leetcode.cn/problems/add-two-numbers/solutions/1732986/by-han-han-ns-fwy9/)









