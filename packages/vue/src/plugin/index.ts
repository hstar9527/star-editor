import { CorePlugin } from "@block-kit/core";

import type {
  VueLeafContext,
  VueLineContext,
  VueNode,
  VueWrapLeafContext,
  VueWrapLineContext,
} from "./types";

export abstract class EditorPlugin extends CorePlugin {
  /**
   * 渲染包装行节点
   * - 调度优先级值越大 DOM 结构在越外层
   */
  public wrapLine?(children: VueWrapLineContext): VueNode;
  /**
   * 渲染包装叶子节点
   * - 调度优先级值越大 DOM 结构在越外层
   */
  public wrapLeaf?(context: VueWrapLeafContext): VueNode;
  /**
   * 渲染行节点
   * - 调度优先级值越大 DOM 结构在越外层
   */
  public renderLine?(context: VueLineContext): VueNode;
  /**
   * 渲染块级子节点
   * - 调度优先级值越大 DOM 结构在越外层
   */
  public renderLeaf?(context: VueLeafContext): VueNode;
}
