import { isEOLOp } from "@block-kit/delta";

import type { LineState } from "../../state/modules/line-state";

/**
 * 判断 Block 行状态
 * - block + void: 独占一行的 Void 节点
 * @param op
 */
export const isBlockLine = (line: LineState | null): boolean => {
  if (!line) return false;
  const firstLeaf = line.getFirstLeaf();
  return !!firstLeaf && firstLeaf.void && !firstLeaf.inline;
};

/**
 * 判断行是否为空行
 * @param line 行状态
 * @param strict 严格模式下会增加对行属性的判断
 */
export const isEmptyLine = (line: LineState, strict = false) => {
  const leaves = line.getLeaves();
  // 如果行没有叶子结点, 则认为是空行
  if (!leaves.length) return true;
  // 叶子结点数必须仅为单个节点, 否则认为非空行
  if (leaves.length !== 1) return false;
  const lastLeaf = line.getLastLeaf()!;
  const op = lastLeaf.op;
  // 末尾节点必须为 EOL Op, 否则认为非空行
  if (!isEOLOp(op)) return false;
  // 非严格模式下已经足够判断条件, 直接返回
  if (!strict) return true;
  const attrs = op.attributes;
  return !attrs || !Object.keys(attrs).length;
};
