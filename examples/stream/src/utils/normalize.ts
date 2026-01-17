import type { P } from "@block-kit/utils/dist/es/types";
import type { MarkedToken, Token } from "marked";

export const isListSuspend = (tree: Token[]) => {
  const len = tree.length;
  const secondToLast = tree[len - 2] as P.Nullish<MarkedToken>;
  const last = tree[len - 1] as P.Nullish<MarkedToken>;
  if (!secondToLast || !last) {
    return false;
  }
  // 最后节点是块结构时, 说明列表已经解析完毕
  if (last.type === "code" || last.type === "table" || last.type === "hr") {
    return false;
  }
  // 多级列表嵌套时, 单个字符流追加的情况下, 会出现无法缩进的情况
  // 1. xxx
  //    [前方三个空格会出现 space 导致归档]
  if (secondToLast.type === "list" && last.type === "space") {
    return true;
  }
  return false;
};

export const normalizeTokenTree = (tree: Token[]) => {
  const copied = [...tree];
  if (!copied.length) return copied;
  const last = copied[copied.length - 1];
  // 若是需要等待后续的数据处理, 就移除最后一个节点
  // Case1: 出现 space 节点可能会存在等待输入的情况, 例如上述的 list
  // 1. xxx
  //    [前方三个空格会出现 space 导致归档]
  if (last.type === "space") {
    copied.pop();
  }
  return copied;
};

export const normalizeFragment = (md: string) => {
  // Case 1: 在缩进的无序列表尾部出现单个 - 时, 需要避免被解析为标题
  // - xxx
  //    -
  const lines = md.split("\n");
  const lastLine = lines[lines.length - 1];
  if (lastLine && /^[ ]{2,}-[ \n]?$/.test(lastLine)) {
    lines.pop();
  }
  return lines.join("\n");
};
