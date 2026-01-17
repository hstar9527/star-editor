import { VOID_KEY } from "@block-kit/core";
import { Range } from "@block-kit/core";
import { Point } from "@block-kit/core";
import type { CSSProperties } from "vue";
import { defineComponent, Fragment, h } from "vue";

import { useEditorStatic } from "../hooks/use-editor";
import type { VueLeafContext } from "../plugin/types";
import { ZeroSpace } from "./zero";

export type VoidProps = {
  className?: string;
  style?: CSSProperties;
  context: VueLeafContext;
  tag?: "span" | "div";
};

/**
 * 空嵌入节点 HOC
 * @param props
 */
export const Void = /*#__PURE__*/ defineComponent<VoidProps>({
  name: "Void",
  props: ["className", "style", "context", "tag"],
  setup: (props, { slots }) => {
    const { editor } = useEditorStatic();
    const Tag = props.tag || "span";
    const leaf = props.context.leafState;

    const onMouseDown = () => {
      // FIX: 修复选区偏移量, leaf 的长度可能 > 1, 而 DOM 节点的长度仅为 1
      const point = new Point(leaf.parent.index, leaf.offset + 1);
      const range = new Range(point, point.clone());
      editor.selection.set(range, true);
    };

    return () =>
      h(Fragment, [
        h(ZeroSpace, { void: true, hide: true, len: leaf.length > 1 ? leaf.length : void 0 }),
        h(
          Tag,
          {
            class: props.className,
            style: { userSelect: "none", ...props.style },
            contentEditable: false,
            [VOID_KEY]: true,
            onMouseDown: onMouseDown,
          },
          slots.default ? slots.default() : void 0
        ),
      ]);
  },
});
