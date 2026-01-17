import { Editor } from "@block-kit/core";
import type { AttributeMap } from "@block-kit/delta";
import { Delta } from "@block-kit/delta";
import { act, render } from "@testing-library/react";

import type { ReactLeafContext } from "../../src/";
import { BlockKit, Editable, EditorPlugin } from "../../src/";
import { waitRenderComplete } from "../config/utils";

const KEY = "link";
class LinkPlugin extends EditorPlugin {
  public key: string = KEY;
  public destroy(): void {}
  public match(attrs: AttributeMap): boolean {
    return !!attrs[KEY];
  }
  public renderLeaf(context: ReactLeafContext): React.ReactNode {
    const attrs = context.attributes;
    if (!attrs) return context.children;
    return <a data-a>{context.children}</a>;
  }
}

describe("dirty structure", () => {
  it("safari dom structure", async () => {
    const delta = new Delta()
      .insert("a", { [KEY]: "true" })
      .insert("text")
      .insertEOL();
    const editor = new Editor({ delta, schema: { [KEY]: { inline: true, mark: true } } });
    editor.plugin.register([new LinkPlugin()]);
    const app = render(
      <BlockKit editor={editor}>
        <Editable></Editable>
      </BlockKit>
    );
    const root = app.container;
    {
      const leaf = root.querySelector("[data-leaf]");
      const a = root.querySelector("[data-a]");
      const span = root.querySelector("[data-string]");
      a!.remove();
      span!.remove();
      span!.childNodes[0].remove();
      span!.appendChild(a!);
      leaf!.appendChild(span!);
      a?.appendChild(document.createTextNode("测试"));
      const a2 = root.querySelector("[data-a]"); // span - a - text
      expect(a2?.parentElement?.hasAttribute("data-string")).toBe(true);
    }
    await act(() => {
      editor.state.apply(new Delta().retain(1).insert("测试"));
      return waitRenderComplete(editor, 10);
    });
    const leaves = root.querySelectorAll("[data-string]");
    expect(leaves[0].firstChild!.nodeValue).toBe("a");
    expect(leaves[0].parentElement!.tagName).toBe("A");
    const leaf = root.querySelector("[data-leaf]");
    expect(leaf?.childNodes.length).toBe(1);
    expect(leaves[1].firstChild!.nodeValue).toBe("测试text");
  });
});
