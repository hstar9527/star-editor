import type { BlocksChange } from "@block-kit/x-json";
import { normalizeBatchOps } from "@block-kit/x-json";

import type { ApplyChange } from "../types";

/**
 * 规范化变更
 * @param changes
 * @returns
 */
export const normalizeBlocksChange = (changes: ApplyChange[]): BlocksChange => {
  // 将相同 Block Id 的变更合并
  const mergedChange: BlocksChange = {};
  for (const change of changes) {
    const blockId = change.id;
    const ops = change.ops;
    mergedChange[blockId] = mergedChange[blockId] || [];
    mergedChange[blockId].push(...ops);
  }
  // 对每个 Block 的变更进行规范化处理
  const normalized: BlocksChange = {};
  for (const [changeId, ops] of Object.entries(mergedChange)) {
    normalized[changeId] = normalizeBatchOps(ops);
  }
  return normalized;
};
