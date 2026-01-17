import { Editor } from "@block-kit/core";
import type { AttributeMap } from "@block-kit/delta";
import { Delta } from "@block-kit/delta";
import { render } from "@testing-library/react";

import type { ReactLeafContext, ReactWrapLeafContext } from "../../src/";
import { BlockKit, Editable, EditorPlugin, InjectWrapKeys } from "../../src/";

const KEY = "link";
class LinkPlugin extends EditorPlugin {
  public key: string = KEY;
  public destroy(): void {}
  public match(attrs: AttributeMap): boolean {
    return !!attrs[KEY];
  }
  @InjectWrapKeys(KEY)
  public wrapLeaf(context: ReactWrapLeafContext): React.ReactNode {
    return <span data-link>{context.children}</span>;
  }
  public renderLeaf(context: ReactLeafContext): React.ReactNode {
    const attrs = context.attributes;
    if (!attrs) return context.children;
    return <a data-a>{context.children}</a>;
  }
}

describe("wraps leaf", () => {
  it("basic", () => {
    const delta = new Delta()
      .insert("text")
      .insert("a", { [KEY]: "true" })
      .insert("b", { [KEY]: "true", bold: "true" })
      .insertEOL();
    const editor = new Editor({ delta });
    editor.plugin.register([new LinkPlugin()]);
    const dom = render(
      <BlockKit editor={editor}>
        <Editable></Editable>
      </BlockKit>
    );
    // <span data-leaf="true"><span data-string="true">text</span></span>
    // <span data-link>
    //   <span data-leaf="true"><a data-a><span data-string="true">a</span></a></span>
    //   <span data-leaf="true"><a data-a><span data-string="true">b</span></a></span>
    // </span>
    const root = dom.container;
    const line = root.querySelector("[data-node]");
    const linkSpanWrap = line?.children[1];
    expect(line?.children.length).toBe(2);
    expect(linkSpanWrap?.hasAttribute("data-link")).toBe(true);
    expect(linkSpanWrap?.children.length).toBe(2);
    expect(linkSpanWrap?.children[0].hasAttribute("data-leaf")).toBe(true);
    expect(linkSpanWrap?.children[0].children[0].hasAttribute("data-a")).toBe(true);
    expect(linkSpanWrap?.children[0].children[0].children[0].firstChild?.nodeValue).toBe("a");
  });
});
