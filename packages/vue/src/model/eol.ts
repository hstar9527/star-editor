import type { Editor, LeafState } from "@block-kit/core";
import { LEAF_KEY } from "@block-kit/core";
import type { P } from "@block-kit/utils/dist/es/types";
import { defineComponent, h } from "vue";

import { ZeroSpace } from "../preset/zero";

export type EOLModelProps = {
  editor: Editor;
  leafState: LeafState;
};

/**
 * EOL Model
 * @param props
 */
export const EOLModel = /*#__PURE__*/ defineComponent<EOLModelProps>({
  name: "EOLModel",
  props: ["editor", "leafState"],
  setup: props => {
    const setModel = (dom: P.Any) => {
      if (dom instanceof HTMLSpanElement) {
        props.editor.model.setLeafModel(dom, props.leafState);
      }
    };

    return () =>
      h(
        "span",
        {
          ref: setModel,
          [LEAF_KEY]: true,
        },
        [h(ZeroSpace, { enter: true })]
      );
  },
});
