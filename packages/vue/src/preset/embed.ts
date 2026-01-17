import { VOID_KEY } from "@block-kit/core";
import { Range } from "@block-kit/core";
import { Point } from "@block-kit/core";
import type { CSSProperties } from "vue";
import { defineComponent, Fragment, h } from "vue";

import { useEditorStatic } from "../hooks/use-editor";
import type { VueLeafContext } from "../plugin/types";
import { ZeroSpace } from "./zero";

export type EmbedProps = {
  className?: string;
  style?: CSSProperties;
  context: VueLeafContext;
};

/**
 * Embed 嵌入节点 HOC
 * - Inline Block HOC
 * @param props
 */
export const Embed = /*#__PURE__*/ defineComponent<EmbedProps>({
  name: "Embed",
  props: ["className", "style", "context"],
  setup: (props, { slots }) => {
    const { editor } = useEditorStatic();
    const leaf = props.context.leafState;

    const onMouseDown = () => {
      const point = new Point(leaf.parent.index, leaf.offset + 1);
      const range = new Range(point, point.clone());
      editor.selection.set(range, true);
    };

    return () =>
      h(Fragment, [
        h(ZeroSpace, { embed: true, len: leaf.length > 1 ? leaf.length : void 0 }),
        h(
          "span",
          {
            class: props.className,
            style: { margin: "0 0.1px", ...props.style },
            contentEditable: false,
            [VOID_KEY]: true,
            onMouseDown: onMouseDown,
          },
          slots.default ? slots.default() : void 0
        ),
      ]);
  },
});
