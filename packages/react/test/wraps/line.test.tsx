import { Editor } from "@block-kit/core";
import type { AttributeMap } from "@block-kit/delta";
import { Delta } from "@block-kit/delta";
import { render } from "@testing-library/react";
import type { ReactNode } from "react";

import type { ReactWrapLineContext } from "../../src/";
import { BlockKit, Editable, EditorPlugin, InjectWrapKeys } from "../../src/";

const KEY = "quote";
class QuotePlugin extends EditorPlugin {
  public key: string = KEY;
  public destroy(): void {}
  public match(attrs: AttributeMap): boolean {
    return !!attrs[KEY];
  }
  @InjectWrapKeys(KEY)
  public wrapLine(context: ReactWrapLineContext): ReactNode {
    if (!context.lineState.attributes[KEY]) {
      return context.children;
    }
    return <div data-quote>{context.children}</div>;
  }
}

describe("wraps line", () => {
  it("basic", () => {
    const delta = new Delta()
      .insert("text\n")
      .insert("a\n", { [KEY]: "true" })
      .insert("b\n", { [KEY]: "true", bold: "true" });
    const editor = new Editor({ delta });
    editor.plugin.register([new QuotePlugin()]);
    const dom = render(
      <BlockKit editor={editor}>
        <Editable></Editable>
      </BlockKit>
    );
    // <div data-node="true">
    //   <span data-leaf="true"><span data-string="true">text</span></span>
    // </div>
    // <div data-quote="true">
    //   <div data-node="true"><span data-leaf="true"><span data-string="true">a</span></span></div>
    //   <div data-node="true"><span data-leaf="true"><span data-string="true">b</span></span></div>
    // </div>
    const root = dom.container;
    const lines = root.querySelectorAll("[data-node]");
    const quotaWrap = root.querySelector("[data-quote]");
    expect(lines.length).toBe(3);
    expect(lines[1].parentElement?.hasAttribute("data-quote")).toBe(true);
    expect(quotaWrap?.children.length).toBe(2);
    expect(Array.from(quotaWrap!.children).every(it => it.hasAttribute("data-node"))).toBe(true);
  });
});
