import { Delta } from "@block-kit/delta";

import { Editor } from "../../src/editor";
import { LOG_LEVEL } from "../../src/log";
import { Range } from "../../src/selection/modules/range";
import { mountEditorViewModel } from "../config/view";

describe("selection move", () => {
  const delta = new Delta({
    ops: [{ insert: "text1 text2 text3" }, { insert: "\n" }],
  });
  const editor = new Editor({ delta, logLevel: LOG_LEVEL.INFO });
  const { leafDOMs } = mountEditorViewModel(editor);

  it("move word", () => {
    const range = Range.fromTuple([0, 11], [0, 11]);
    editor.selection.set(range, true);
    const newRange = editor.selection.move("word", "backward");
    expect(newRange).toEqual(Range.fromTuple([0, 6], [0, 6]));
  });

  it("collapse range forward", () => {
    const range = Range.fromTuple([0, 3], [0, 9]);
    editor.selection.set(range, true);
    editor.selection.collapse();
    const { focusNode, focusOffset, anchorNode, anchorOffset } = window.getSelection()!;
    expect(focusNode).toBe(leafDOMs[0][0].querySelector("[data-string]")!.firstChild);
    expect(focusOffset).toBe(9);
    expect(anchorNode).toBe(focusNode);
    expect(anchorOffset).toBe(9);
    expect(editor.selection.get()).toEqual(Range.fromTuple([0, 9], [0, 9]));
  });

  it("collapse range backward", () => {
    const range = Range.fromTuple([0, 3], [0, 9]);
    editor.selection.set(range, true);
    editor.selection.collapse("backward");
    const { focusNode, focusOffset, anchorNode, anchorOffset } = window.getSelection()!;
    expect(focusNode).toBe(leafDOMs[0][0].querySelector("[data-string]")!.firstChild);
    expect(focusOffset).toBe(3);
    expect(anchorNode).toBe(focusNode);
    expect(anchorOffset).toBe(3);
    expect(editor.selection.get()).toEqual(Range.fromTuple([0, 3], [0, 3]));
  });
});
