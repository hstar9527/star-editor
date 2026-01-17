import type { Ops } from "../delta/interface";

export const BLOCK_TYPE = {
  /** 内容块类型 - Content */
  C: "C",
  /** 列表块类型 - List */
  L: "L",
} as const;

export type BlockOption = {
  ops?: Ops;
  id?: string;
  type?: string;
};

export type BlockLike = Required<BlockOption>;
export type BlockSetLike = Record<string, BlockLike>;
export type DeltaLike = Omit<BlockLike, "id" | "type">;
export type BlockSetOption = Record<string, BlockOption>;
