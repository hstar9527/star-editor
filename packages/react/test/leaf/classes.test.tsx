import { Editor } from "@block-kit/core";
import { Delta } from "@block-kit/delta";
import { render } from "@testing-library/react";
import { act } from "react-dom/test-utils";

import { InlineCodePlugin } from "../../../plugin/src/inline-code/index";
import { INLINE_CODE_KEY } from "../../../plugin/src/inline-code/types";
import { BlockKit, Editable } from "../../src";
import { waitRenderComplete } from "../config/utils";

describe("leaf classes", () => {
  it("inline code classes compose", async () => {
    const delta = new Delta()
      .insert("text")
      .insert("aaa", { [INLINE_CODE_KEY]: "true" })
      .insert("b", { [INLINE_CODE_KEY]: "true", bold: "true" })
      .insertEOL();
    const editor = new Editor({ delta });
    editor.plugin.register([new InlineCodePlugin(editor)]);
    const dom = render(
      <BlockKit editor={editor}>
        <Editable></Editable>
      </BlockKit>
    );
    const root = dom.container;
    const leafNodes = root.querySelectorAll("[data-leaf]");
    expect(leafNodes[1].className).toBe("block-kit-inline-code-start block-kit-inline-code");
    expect(leafNodes[2].className).toBe("block-kit-inline-code block-kit-inline-code-end");
    await act(() => {
      editor.state.apply(new Delta().retain(7).delete(1));
      return waitRenderComplete(editor, 10);
    });
    const leafNodes2 = root.querySelectorAll("[data-leaf]");
    expect(leafNodes2[1].className).toBe(
      "block-kit-inline-code-start block-kit-inline-code block-kit-inline-code-end"
    );
  });

  it("inline code delete leaf", async () => {
    const delta = new Delta()
      .insert("text")
      .insert("aaa", { [INLINE_CODE_KEY]: "true" })
      .insert("b", { [INLINE_CODE_KEY]: "true", bold: "true" })
      .insertEOL();
    const editor = new Editor({ delta });
    editor.plugin.register([new InlineCodePlugin(editor)]);
    const dom = render(
      <BlockKit editor={editor}>
        <Editable></Editable>
      </BlockKit>
    );
    await act(() => {
      editor.state.apply(new Delta().retain(7).delete(1));
      return waitRenderComplete(editor, 10);
    });
    await act(() => {
      editor.state.apply(new Delta().retain(6).retain(1, { bold: "true" }));
      return waitRenderComplete(editor, 10);
    });
    const root = dom.container;
    const leafNodes = root.querySelectorAll("[data-leaf]");
    expect(leafNodes[1].className).toBe("block-kit-inline-code-start block-kit-inline-code");
    expect(leafNodes[2].className).toBe("block-kit-inline-code block-kit-inline-code-end");
  });
});
