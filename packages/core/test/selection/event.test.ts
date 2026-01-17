import { Delta } from "@block-kit/delta";

import { Editor, LOG_LEVEL, Range } from "../../src";
import { mountEditorViewModel } from "../config/view";

describe("selection event", () => {
  const delta = new Delta({
    ops: [
      { insert: "text" },
      { insert: "bold", attributes: { bold: "true" } },
      { insert: "\n" },
      { insert: "text2" },
      { insert: "bold2", attributes: { bold: "true" } },
      { insert: "\n" },
    ],
  });
  const editor = new Editor({ delta, logLevel: LOG_LEVEL.INFO });
  const { leafDOMs, lineDOMs } = mountEditorViewModel(editor);

  it("selection change event", () => {
    const sel = document.getSelection();
    sel?.setBaseAndExtent(
      leafDOMs[0][0].querySelector("[data-string]")!.firstChild!,
      0,
      leafDOMs[0][1].querySelector("[data-string]")!.firstChild!,
      0
    );
    document.dispatchEvent(new Event("selectionchange"));
    expect(editor.selection.get()).toEqual(Range.fromTuple([0, 0], [0, 4]));
  });

  it("actively set selection", () => {
    editor.selection.set(Range.fromTuple([0, 0], [0, 4]), true);
    const sel = document.getSelection();
    // <span data-leaf="true"><span data-string="true">text</span></span>
    expect(sel?.anchorNode).toBe(leafDOMs[0][0].firstChild?.firstChild);
    expect(sel?.focusNode).toEqual(leafDOMs[0][0].firstChild?.firstChild);
    expect(sel?.anchorOffset).toEqual(0);
    expect(sel?.focusOffset).toEqual(4);
  });

  it("triple click to select line", () => {
    const sel = document.getSelection();
    sel?.setBaseAndExtent(leafDOMs[0][0], 0, lineDOMs[1], 0);
    document.dispatchEvent(new Event("selectionchange"));
    expect(editor.selection.get()).toEqual(Range.fromTuple([0, 0], [1, 0]));
  });
});
