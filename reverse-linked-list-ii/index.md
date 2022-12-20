# 力扣-反转链表 II

    
:link: [题目链接](https://leetcode.cn/problems/reverse-linked-list-ii)

给你单链表的头指针 `head` 和两个整数 `left` 和 `right`，其中 `left <= right`。请你反转从位置 `left` 到位置 `right` 的链表节点，返回**反转后的链表**。

{{<image src="/images/left.jpg" caption="示例1" width="400">}}

{{< admonition example "示例 1：" true>}}
**输入**：head = [1,2,3,4,5], left = 2, right = 4<br>
**输出**：[1,4,3,2,5]
{{< /admonition >}}

{{< admonition example "示例 2：" true>}}
**输入**：head = [5], left = 1, right = 1<br>
**输出**：[5]
{{< /admonition >}}

**提示**：

- 链表中节点数目为 $n$
- $1 <= n <= 500$
- $-500 <= Node.val <= 500$
- $1 <= left <= right <= n$

## 前言

链表的操作问题，一般而言面试（机试）的时候不允许我们修改节点的值，而只能修改节点的指向操作。[^1]

思路通常都不难，写对链表问题的技巧是：一定要先想清楚思路，并且必要的时候在草稿纸上画图，理清「穿针引线」的先后步骤，然后再编码。

## 穿针引线

我们以下图中黄色区域的链表反转为例。

{{<image src="/images/链表反转.png" caption="链表反转" width="800">}}

使用「[206. 反转链表](https://leetcode.cn/problems/reverse-linked-list)」的解法，反转 `left` 到 `right` 部分以后，再拼接起来。我们还需要记录 `left` 的前一个节点，和 `right` 的后一个节点。如图所示：

{{<image src="/images/right.png" caption="链表反转" width="600">}}

**算法步骤：**

- 第 1 步：先将待反转的区域反转；
- 第 2 步：把 `pre` 的 `next` 指针指向反转以后的链表头节点，把反转以后的链表的尾节点的 `next` 指针指向 `succ`。

{{<image src="/images/succ.png" caption="链表反转" width="600">}}

**说明**：编码细节我们不在题解中介绍了，请见下方代码。思路想明白以后，编码不是一件很难的事情。这里要提醒大家的是，链接什么时候切断，什么时候补上去，先后顺序一定要想清楚，如果想不清楚，可以在纸上模拟，让思路清晰。

```python
def reverseBetween(head: ListNode, left: int, right: int) -> ListNode:
    def reverse_linked_list(head: ListNode):
        # 也可以使用递归反转一个链表
        pre = None
        cur = head
        while cur:
            next = cur.next
            cur.next = pre
            pre = cur
            cur = next

    # 因为头节点有可能发生变化，使用虚拟头节点可以避免复杂的分类讨论
    dummy_node = ListNode(-1)
    dummy_node.next = head
    pre = dummy_node
    # 第 1 步：从虚拟头节点走 left - 1 步，来到 left 节点的前一个节点
    # 建议写在 for 循环里，语义清晰
    for _ in range(left - 1):
        pre = pre.next

    # 第 2 步：从 pre 再走 right - left + 1 步，来到 right 节点
    right_node = pre
    for _ in range(right - left + 1):
        right_node = right_node.next
    # 第 3 步：切断出一个子链表（截取链表）
    left_node = pre.next
    curr = right_node.next

    # 注意：切断链接
    pre.next = None
    right_node.next = None

    # 第 4 步：同第 206 题，反转链表的子区间
    reverse_linked_list(left_node)
    # 第 5 步：接回到原来的链表中
    pre.next = right_node
    left_node.next = curr
    return dummy_node.next
```

**复杂度分析**

- 时间复杂度：$O(N)$，其中 $N$ 是链表总节点数。最坏情况下，需要遍历整个链表。
- 空间复杂度：$O(1)$。只使用到常数个变量。

[^1]: [反转链表 II](https://leetcode.cn/problems/reverse-linked-list-ii/solutions/634701/fan-zhuan-lian-biao-ii-by-leetcode-solut-teyq/)







