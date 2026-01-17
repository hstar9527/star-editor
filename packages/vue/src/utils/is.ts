import type { LineState } from "@block-kit/core";

export const isStrictEmptyLine = (line: LineState) => {
  const leaves = line.getLeaves();
  if (!leaves.length) {
    return true;
  }
  if (
    leaves.length === 1 &&
    leaves[0].eol &&
    (!leaves[0].op.attributes || !Object.keys(leaves[0].op.attributes).length)
  ) {
    return true;
  }
  return false;
};
