import "./styles/index.scss";

import type { Editor } from "@block-kit/core";
import type { AttributeMap } from "@block-kit/delta";
import type { ReactLeafContext } from "@block-kit/react";
import { Embed } from "@block-kit/react";
import { EditorPlugin } from "@block-kit/react";
import type { ReactNode } from "react";

import { SuggestModule } from "./modules/suggest";
import { MENTION_KEY, MENTION_NAME } from "./types";

export class MentionPlugin extends EditorPlugin {
  public key = MENTION_KEY;
  protected suggest: SuggestModule;

  constructor(protected editor: Editor) {
    super();
    this.suggest = new SuggestModule(editor);
  }

  public destroy(): void {
    this.suggest.destroy();
  }

  public match(attrs: AttributeMap): boolean {
    return !!attrs[MENTION_KEY];
  }

  public renderLeaf(context: ReactLeafContext): ReactNode {
    const attrs = context.attributes || {};
    const name = attrs[MENTION_NAME];
    if (!name || !attrs[MENTION_KEY]) return context.children;
    return (
      <Embed className="block-kit-mention-embed" context={context}>
        <span className="block-kit-mention-name">@{name}</span>
      </Embed>
    );
  }
}
