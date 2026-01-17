import type { CSSProperties } from "vue";
import { defineComponent, h } from "vue";

import { preventNativeEvent } from "../utils/event";

export type IsolateProps = {
  className?: string;
  style?: CSSProperties;
};

/**
 * 独立节点嵌入 HOC
 * - 独立区域 完全隔离所有事件
 * @param props
 */
export const Isolate = /*#__PURE__*/ defineComponent<IsolateProps>({
  name: "Isolate",
  props: ["className", "style"],
  setup: (props, { slots }) => {
    return () =>
      h(
        "span",
        {
          class: props.className,
          style: { userSelect: "none", ...props.style },
          contentEditable: false,
          onMouseDown: preventNativeEvent,
          onCopy: preventNativeEvent,
        },
        slots.default ? slots.default() : void 0
      );
  },
});
