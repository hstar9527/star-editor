import type { LeafContext, LeafState, LineContext, LineState } from "@block-kit/core";
import type { VNode } from "vue";

export type VueNode = VNode | VNode[] | string | number | boolean | undefined;

/**
 * 包装行状态
 */
export type VueWrapLineContext = {
  lineState: LineState;
  children?: VueNode;
};

/**
 * 包装叶子状态
 */
export type VueWrapLeafContext = {
  leafState: LeafState;
  children?: VueNode;
};

/**
 * 行状态
 */
export interface VueLineContext extends LineContext {
  children?: VueNode;
}

/**
 * 叶子状态
 */
export interface VueLeafContext extends LeafContext {
  children?: VueNode;
}

/**
 * 包装类型
 */
export const WRAP_TYPE = {
  LINE: "wrapLine",
  LEAF: "wrapLeaf",
} as const;
