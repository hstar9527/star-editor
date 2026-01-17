import { Delta } from "@block-kit/delta";
import { MutateDelta } from "@block-kit/delta";
import { sleep } from "@block-kit/utils";

import { Range, RawRange } from "../../src";
import { Editor } from "../../src/editor";

describe("history undo-redo", () => {
  it("undo & redo", async () => {
    const editor = new Editor();
    // @ts-expect-error protected readonly property
    editor.history.DELAY = 10;
    editor.state.apply(new Delta().insert("1")); // 1
    await sleep(20);
    editor.state.apply(new Delta().retain(1).insert("2", { src: "blob" })); // 12
    await sleep(20);
    editor.state.apply(new Delta().retain(1).insert("3")); // 132
    await sleep(20);
    editor.state.apply(new Delta().retain(2).retain(1, { src: "http" })); // 132
    expect(editor.state.toBlock()).toEqual(
      new MutateDelta().insert("13").insert("2", { src: "http" }).insertEOL()
    );
    expect(editor.history.isUndoAble()).toBe(true);
    expect(editor.history.isRedoAble()).toBe(false);
    editor.history.undo();
    expect(editor.state.toBlock()).toEqual(
      new MutateDelta().insert("13").insert("2", { src: "blob" }).insertEOL()
    );
    editor.history.undo();
    expect(editor.state.toBlock()).toEqual(
      new MutateDelta().insert("1").insert("2", { src: "blob" }).insertEOL()
    );
    editor.history.undo();
    expect(editor.state.toBlock()).toEqual(new MutateDelta().insert("1").insertEOL());
    editor.history.undo();
    expect(editor.state.toBlock()).toEqual(new MutateDelta().insertEOL());
    expect(editor.history.isUndoAble()).toBe(false);
    editor.history.redo();
    expect(editor.state.toBlock()).toEqual(new MutateDelta().insert("1").insertEOL());
    editor.history.redo();
    expect(editor.state.toBlock()).toEqual(
      new MutateDelta().insert("1").insert("2", { src: "blob" }).insertEOL()
    );
    editor.history.redo();
    expect(editor.state.toBlock()).toEqual(
      new MutateDelta().insert("13").insert("2", { src: "blob" }).insertEOL()
    );
    editor.history.redo();
    expect(editor.state.toBlock()).toEqual(
      new MutateDelta().insert("13").insert("2", { src: "http" }).insertEOL()
    );
    expect(editor.history.isUndoAble()).toBe(true);
    expect(editor.history.isRedoAble()).toBe(false);
  });

  it("auto compose", async () => {
    const editor = new Editor();
    const { id: id0 } = editor.state.apply(new Delta().insert("1"));
    await sleep(20);
    const { id: id1 } = editor.state.apply(new Delta().retain(1).insert("2"));
    await sleep(20);
    const { id: id2 } = editor.state.apply(new Delta().retain(1).insert("3"));
    expect(editor.state.toBlock()).toEqual(new MutateDelta().insert("132").insertEOL());
    // @ts-expect-error protected property
    const undoStack = editor.history.undoStack;
    expect(undoStack[0].id).toEqual(new Set([id0, id1, id2]));
  });

  it("selection restore", async () => {
    const editor = new Editor();
    editor.selection.set(Range.fromTuple([0, 0], [0, 0]));
    editor.state.apply(new Delta().insert("xxx"));
    // @ts-expect-error protected property
    const undoStack = editor.history.undoStack;
    // @ts-expect-error protected property
    const redoStack = editor.history.redoStack;
    expect(undoStack[0].range).toEqual(RawRange.fromEdge(0, 0));
    editor.history.undo();
    expect(editor.selection.get()).toEqual(Range.fromTuple([0, 0], [0, 0]));
    expect(redoStack[0].range).toEqual(RawRange.from(3, 0));
  });
});
