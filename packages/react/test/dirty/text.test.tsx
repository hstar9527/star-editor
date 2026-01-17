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

describe("dirty text", () => {
  it("inline node text", async () => {
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
    // app.debug(root);
    {
      const leaves = root.querySelectorAll("[data-string]");
      leaves[0].firstChild!.nodeValue = "a测试";
      expect(leaves[0].firstChild!.nodeValue).toBe("a测试");
    }
    await act(() => {
      editor.state.apply(new Delta().retain(1).insert("测试"));
      return waitRenderComplete(editor);
    });
    const leaves2 = root.querySelectorAll("[data-string]");
    expect(leaves2[0].firstChild!.nodeValue).toBe("a");
    expect(leaves2[1].firstChild!.nodeValue).toBe("测试text");
  });

  it("chrome extra text node", async () => {
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
      const a = root.querySelector("[data-a]");
      a?.parentElement?.appendChild(document.createTextNode("测试"));
      const leaf = root.querySelector("[data-leaf]");
      expect(leaf?.querySelector("[data-string]")!.firstChild!.nodeValue).toBe("a");
      expect(leaf?.childNodes.length).toBe(2);
      expect(leaf?.childNodes[1].nodeValue).toBe("测试");
    }
    await act(() => {
      editor.state.apply(new Delta().retain(1).insert("测试"));
      return waitRenderComplete(editor);
    });
    const leaves = root.querySelectorAll("[data-string]");
    expect(leaves[0].firstChild!.nodeValue).toBe("a");
    const leaf = root.querySelector("[data-leaf]");
    expect(leaf?.childNodes.length).toBe(1);
    expect(leaves[1].firstChild!.nodeValue).toBe("测试text");
  });

  it("firefox extra string node", async () => {
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
      const a = root.querySelector("[data-a]");
      const stringNode = document.createElement("span");
      stringNode.setAttribute("data-string", "true");
      stringNode.appendChild(document.createTextNode("测试"));
      a?.parentElement?.appendChild(stringNode);
      const leaf = root.querySelector("[data-leaf]");
      expect(leaf?.querySelector("[data-string]")!.firstChild!.nodeValue).toBe("a");
      expect(leaf?.childNodes.length).toBe(2);
      expect(leaf?.childNodes[1].childNodes[0].nodeValue).toBe("测试");
    }
    await act(() => {
      editor.state.apply(new Delta().retain(1).insert("测试"));
      return waitRenderComplete(editor);
    });
    const leaves = root.querySelectorAll("[data-string]");
    expect(leaves[0].firstChild!.nodeValue).toBe("a");
    const leaf = root.querySelector("[data-leaf]");
    expect(leaf?.childNodes.length).toBe(1);
    expect(leaves[1].firstChild!.nodeValue).toBe("测试text");
  });
});
