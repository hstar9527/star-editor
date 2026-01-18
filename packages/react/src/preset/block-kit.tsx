import type { Editor } from "@block-kit/core";
import { EDITOR_STATE } from "@block-kit/core";
import type { ReactNode } from "react";
import { useMemo } from "react";

import { BlockKitContext } from "../hooks/use-editor";
import { ReadonlyContext } from "../hooks/use-readonly";
import { PortalModel } from "../model/portal";
import { initWrapPlugins } from "../plugin/modules/wrap";

export type BlockKitProps = {
  editor: Editor;
  readonly?: boolean;
  children?: ReactNode;
};

export const BlockKit: React.FC<BlockKitProps> = props => {
  const { editor, readonly, children } = props;

  if (editor.state.get(EDITOR_STATE.READONLY) !== readonly) {
    editor.state.set(EDITOR_STATE.READONLY, readonly || false);
  }

  useMemo(() => {
    // 希望在 Editor 初始化后立即执行一次
    initWrapPlugins(editor);
  }, [editor]);

  return (
    <BlockKitContext.Provider value={editor}>
      <ReadonlyContext.Provider value={!!readonly}>
        <PortalModel editor={editor}></PortalModel>
        {children}
      </ReadonlyContext.Provider>
    </BlockKitContext.Provider>
  );
};
