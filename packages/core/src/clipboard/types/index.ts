import type { Delta, Op } from "@block-kit/delta";
import type { O } from "@block-kit/utils/dist/es/types";

export const TEXT_DOC = "application/x-block-kit";

/** Fragment(Delta) => HTML */
export type SerializeContext = {
  /** Op 基准 */
  op: Op;
  /** HTML 目标 */
  html: Node;
};

/** Context => Clipboard */
export type CopyContext = {
  /** Delta 基准 */
  delta: Delta;
  /** HTML 目标 */
  html: Node;
  /** 额外内容 */
  extra?: O.Map<string>;
};

/** HTML => Fragment(Delta)  */
export type DeserializeContext = {
  /** Delta 目标 */
  delta: Delta;
  /** HTML 基准 */
  html: Node;
  /** FILE 基准 */
  files?: File[];
};

/** Clipboard => Context */
export type PasteContext = {
  /** Delta 基准 */
  delta: Delta;
  /** 粘贴事件 */
  event: ClipboardEvent;
};
