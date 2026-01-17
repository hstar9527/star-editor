import { BOLD_KEY } from "../../bold/types";
import { INLINE_CODE_KEY } from "../../inline-code/types";

export const TOOLBAR_TYPES = [BOLD_KEY, INLINE_CODE_KEY] as const;
export const TOOLBAR_KEY_SET = new Set(TOOLBAR_TYPES);

export type ToolbarProps = {
  className?: string;
  children: React.ReactNode;
  styles?: React.CSSProperties;
  onRef?: React.MutableRefObject<HTMLDivElement | null>;
};
