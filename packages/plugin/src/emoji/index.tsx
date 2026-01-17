import "./styles/index.scss";

import type { CMDPayload } from "@block-kit/core";
import type { Editor } from "@block-kit/core";
import { RawRange } from "@block-kit/core";
import type { AttributeMap } from "@block-kit/delta";
import { Delta } from "@block-kit/delta";
import type { ReactLeafContext } from "@block-kit/react";
import { Embed } from "@block-kit/react";
import { EditorPlugin } from "@block-kit/react";
import { Bind } from "@block-kit/utils";
import data from "@emoji-mart/data";
import { init } from "emoji-mart";
import type { ReactNode } from "react";

import { EMOJI_KEY } from "./types";

export class EmojiPlugin extends EditorPlugin {
  public key = EMOJI_KEY;

  constructor(protected editor: Editor) {
    super();
    init({ data });
    editor.command.register(EMOJI_KEY, this.onExec);
  }

  public destroy(): void {}

  public match(attrs: AttributeMap): boolean {
    return !!attrs[EMOJI_KEY];
  }

  @Bind
  public onExec(payload: CMDPayload) {
    const editor = this.editor;
    const sel = payload.range || editor.selection.get();
    if (!sel) return void 0;
    const value = payload.value;
    const delta = new Delta();
    const raw = RawRange.fromRange(editor, sel);
    if (!raw) return void 0;
    delta
      .retain(raw.start)
      .delete(raw.len)
      .insert(" ", { [EMOJI_KEY]: value });
    editor.state.apply(delta);
  }

  public renderLeaf(context: ReactLeafContext): ReactNode {
    const attrs = context.attributes || {};
    const id = attrs[EMOJI_KEY];
    if (!id) return context.children;
    return (
      <Embed className="block-kit-emoji" context={context}>
        <em-emoji id={id}></em-emoji>
      </Embed>
    );
  }
}
