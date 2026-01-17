import type { P } from "@block-kit/utils/dist/es/types";

import type { Path, Side } from "./types";

export type Subtype = {
  /** 子类型名 */
  name: string;
  /** 规范地址 */
  uri?: string;
  /** 反转变更 */
  invert: (ops: P.Any, snapshot?: P.Any) => P.Any;
  /** 应用变更 */
  apply: (snapshot: P.Any, ops: P.Any) => void;
  /** 组合变更 */
  compose: (ops1: P.Any, ops2: P.Any) => P.Any;
  /** 操作变换 */
  transform: (ops1: P.Any, ops2: P.Any, side?: Side) => P.Any;
  /** 规范化变更 */
  normalize?: (ops: P.Any) => P.Any;
  /** 序列化变更 */
  serialize?: (ops: P.Any) => string;
  /** 反序列化变更 */
  deserialize?: (str: string) => P.Any;
  /** 操作变换光标 */
  transformCursor?: (cursor: number, ops: P.Any, side?: Side) => number;
};

export interface SubtypeOpMap {
  text: { p: number; i?: string; d?: string };
}

/**
 * applies the subtype op o of type t(registered subtype) to the object at [path]
 */
export type SubtypeOp<T extends keyof SubtypeOpMap> = {
  p: Path;
  t: T;
  o: SubtypeOpMap[T];
};

export const subtypes: Record<string, Subtype> = {};
