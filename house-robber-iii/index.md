# 力扣-打家劫舍 III

    
:link: [题目链接](https://leetcode.cn/problems/house-robber-iii)

小偷又发现了一个新的可行窃的地区。这个地区只有一个入口，我们称之为 `root`。

除了 `root` 之外，每栋房子有且只有一个“父”房子与之相连。一番侦察之后，聪明的小偷意识到“这个地方的所有房屋的排列类似于一棵二叉树”。 如果**两个直接相连的房子在同一天晚上被打劫**，房屋将自动报警。

给定二叉树的 `root` 。返回**在不触动警报的情况下**，小偷能够盗取的最高金额。

{{< admonition example "示例 1：" true>}}
**输入**：root = [3,2,3,null,3,null,1]<br>
**输出**：7<br>
**解释**：小偷一晚能够盗取的最高金额 3 + 3 + 1 = 7
{{< /admonition >}}

{{<image src="/images/rob1.jpg" caption="示例1" width="200">}}

{{< admonition example "示例 2：" true>}}
**输入**：root = [3,4,5,1,3,null,1]<br>
**输出**：9<br>
**解释**：小偷一晚能够盗取的最高金额 4 + 5 = 9
{{< /admonition >}}

{{<image src="/images/rob2.jpg" caption="示例2" width="200">}}

**提示**：

- 树的节点数在 $[1, 10^4]$ 范围内
- $0 <= Node.val <= 10^4$

**解题思路**

递归处理，返回当前节点偷与不偷的两个结果，取其中最大的一个。[^1]

**代码**

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def rob(self, root: TreeNode) -> int:
        def _rob(root):
            if not root: return 0, 0  # 偷，不偷

            left = _rob(root.left)
            right = _rob(root.right)
            # 偷当前节点, 则左右子树都不能偷
            v1 = root.val + left[1] + right[1]
            # 不偷当前节点, 则取左右子树中最大的值
            v2 = max(left) + max(right)
            return v1, v2

        return max(_rob(root))
```

[^1]: [递归处理-返回偷与不偷两种结果（Python3）](https://leetcode.cn/problems/house-robber-iii/solutions/361741/di-gui-chu-li-fan-hui-tou-yu-bu-tou-liang-chong-ji)









