import type { Editor } from "@block-kit/core";
import { EDITOR_STATE } from "@block-kit/core";
import { defineComponent, provide, watchSyncEffect } from "vue";

import { BlockKitContext } from "../hooks/use-editor";
import { ReadonlyContext } from "../hooks/use-readonly";

export type BlockKitProps = {
  editor: Editor;
  readonly?: boolean;
};

export const BlockKit = /*#__PURE__*/ defineComponent<BlockKitProps>({
  name: "BlockKit",
  props: ["editor", "readonly"],
  setup: (props, { slots }) => {
    watchSyncEffect(() => {
      if (props.editor.state.get(EDITOR_STATE.READONLY) !== props.readonly) {
        props.editor.state.set(EDITOR_STATE.READONLY, props.readonly || false);
      }
    });

    provide(BlockKitContext, props.editor);
    provide(ReadonlyContext, !!props.readonly);

    return () => {
      return slots.default ? slots.default() : null;
    };
  },
});
