import type { Editor } from "@block-kit/core";
import React, { createContext } from "react";

export const BlockKitContext = createContext<Editor | null>(null);
BlockKitContext.displayName = "BlockKit";

export const useEditorStatic = () => {
  const editor = React.useContext(BlockKitContext);

  if (!editor) {
    throw new Error("UseEditor must be used within a EditorContext");
  }

  return {
    editor,
    rect: editor.rect,
    state: editor.state,
    event: editor.event,
    input: editor.input,
    model: editor.model,
    plugin: editor.plugin,
    schema: editor.schema,
    logger: editor.logger,
    lookup: editor.lookup,
    tracer: editor.tracer,
    command: editor.command,
    history: editor.history,
    perform: editor.perform,
    clipboard: editor.clipboard,
    selection: editor.selection,
  };
};
