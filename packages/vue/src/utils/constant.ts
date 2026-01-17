import type { CSSProperties } from "vue";

export const NO_CURSOR: CSSProperties = {
  width: 0,
  height: 0,
  color: "transparent",
  position: "absolute",
} as const;
