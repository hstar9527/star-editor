import { Delta } from "@block-kit/delta";

import { Editor } from "../../src/editor";

describe("state key", () => {
  it("line reuse", () => {
    const delta = new Delta().insert("text").insertEOL();
    const editor = new Editor({ delta });
    const line = editor.state.block.getLine(0);
    const key = line!.key;
    editor.state.apply(new Delta().retain(5).insertEOL());
    const newLine = editor.state.block.getLine(0);
    expect(newLine!.key).toBe(key);
    expect(line).toBe(newLine);
  });

  it("line key reuse - leaf change", () => {
    const delta = new Delta().insert("text").insertEOL();
    const editor = new Editor({ delta });
    const line = editor.state.block.getLine(0);
    const line0Key = line!.key;
    editor.state.apply(new Delta().retain(2).insert("1"));
    const newLine = editor.state.block.getLine(0);
    expect(newLine!.key).toBe(line0Key);
    expect(line).not.toBe(newLine);
  });

  it("line key reuse - attrs change", () => {
    const delta = new Delta().insert("text").insertEOL();
    const editor = new Editor({ delta });
    const line = editor.state.block.getLine(0);
    const line0Key = line!.key;
    const key1 = line!.getLeaf(1)!.key;
    editor.state.apply(new Delta().retain(4).retain(1, { heading: "h1" }));
    const newLine = editor.state.block.getLine(0);
    expect(newLine!.key).toBe(line0Key);
    expect(line).not.toBe(newLine);
    expect(newLine!.getLeaf(1)!.key).toBe(key1);
  });

  it("leaf reuse", () => {
    const delta = new Delta().insert("text").insertEOL();
    const editor = new Editor({ delta });
    const line = editor.state.block.getLine(0);
    const leaf = line!.getLeaf(0);
    const key = leaf!.key;
    editor.state.apply(new Delta().retain(5).insertEOL());
    const newLeaf = line!.getLeaf(0);
    expect(newLeaf!.key).toBe(key);
    expect(leaf).toBe(newLeaf);
  });

  it("leaf key reuse - insert", () => {
    const delta = new Delta().insert("text").insertEOL();
    const editor = new Editor({ delta });
    const line0 = editor.state.block.getLine(0);
    const leaf0 = line0!.getLeaf(0);
    const leaf1 = line0!.getLeaf(1);
    const key0 = leaf0!.key;
    editor.state.apply(new Delta().retain(4).insert("1"));
    const newLine0 = editor.state.block.getLine(0);
    const newLeaf0 = newLine0!.getLeaf(0);
    const newLeaf1 = newLine0!.getLeaf(1);
    expect(newLeaf0!.key).toBe(key0);
    expect(newLeaf0).not.toBe(leaf0);
    expect(newLeaf1).toBe(leaf1);
  });

  it("leaf key reuse - merge tail", () => {
    const delta = new Delta().insert("te").insert("xt", { bold: "true" }).insertEOL();
    const editor = new Editor({ delta });
    const line0 = editor.state.block.getLine(0);
    const leaf0 = line0!.getLeaf(0);
    const leaf2 = line0!.getLeaf(2);
    const key0 = leaf0!.key;
    editor.state.apply(new Delta().retain(2).retain(2, { bold: "" }));
    const newLine0 = editor.state.block.getLine(0);
    const newLeaf0 = newLine0!.getLeaf(0);
    const newLeaf1 = newLine0!.getLeaf(1);
    expect(newLeaf0!.key).toBe(key0);
    expect(newLeaf0).not.toBe(leaf0);
    expect(newLeaf1).toBe(leaf2);
  });

  it("leaf key reuse - merge head", () => {
    const delta = new Delta().insert("te", { bold: "true" }).insert("ex").insertEOL();
    const editor = new Editor({ delta });
    const line0 = editor.state.block.getLine(0);
    const leaf0 = line0!.getLeaf(0);
    const leaf2 = line0!.getLeaf(2);
    const key0 = leaf0!.key;
    editor.state.apply(new Delta().retain(2, { bold: "" }));
    const newLine0 = editor.state.block.getLine(0);
    const newLeaf0 = newLine0!.getLeaf(0);
    const newLeaf1 = newLine0!.getLeaf(1);
    expect(newLeaf0!.key).toBe(key0);
    expect(newLeaf0).not.toBe(leaf0);
    expect(newLeaf1).toBe(leaf2);
  });

  it("leaf key reuse - tail attrs change", () => {
    const delta = new Delta().insert("text").insertEOL();
    const editor = new Editor({ delta });
    const line0 = editor.state.block.getLine(0);
    const leaf0 = line0!.getLeaf(0);
    const key0 = leaf0!.key;
    editor.state.apply(new Delta().retain(2).retain(2, { bold: "true" }));
    const newLine0 = editor.state.block.getLine(0);
    const newLeaf0 = newLine0!.getLeaf(0);
    const newLeaf1 = newLine0!.getLeaf(1);
    expect(newLeaf0!.key).toBe(key0);
    expect(newLeaf0).not.toBe(leaf0);
    expect(newLeaf1!.key).not.toBe(key0);
  });

  it("leaf key reuse - head attrs change", () => {
    const delta = new Delta().insert("text").insertEOL();
    const editor = new Editor({ delta });
    const line0 = editor.state.block.getLine(0);
    const leaf0 = line0!.getLeaf(0);
    const key0 = leaf0!.key;
    editor.state.apply(new Delta().retain(2, { bold: "true" }));
    const newLine0 = editor.state.block.getLine(0);
    const newLeaf0 = newLine0!.getLeaf(0);
    const newLeaf1 = newLine0!.getLeaf(1);
    expect(newLeaf0!.key).toBe(key0);
    expect(newLeaf0).not.toBe(leaf0);
    expect(newLeaf1!.key).not.toBe(key0);
  });

  it("leaf key sequential values", () => {
    // [[text 0][\n 1]2] => [[te 0][xt 3][\n 1]2]
    const delta = new Delta().insert("text").insertEOL();
    const editor = new Editor({ delta });
    const line0 = editor.state.block.getLine(0);
    const leaf0 = line0!.getLeaf(0);
    const key0 = Number(leaf0!.key);
    editor.state.apply(new Delta().retain(2).retain(2, { bold: "true" }));
    const newLine0 = editor.state.block.getLine(0);
    const newLeaf0 = newLine0!.getLeaf(0);
    const newLeaf1 = newLine0!.getLeaf(1);
    const newKey0 = Number(newLeaf0!.key);
    const newKey1 = Number(newLeaf1!.key);
    // console.log(
    //   editor.state.block.getLines().map(l => [l.getLeaves().map(leaf => leaf.key), l.key])
    // );
    expect(newKey0).toBe(key0);
    expect(newKey1).toBe(key0 + 3);
    expect(Number(newLeaf1!.parent.key)).toBe(key0 + 2);
  });

  it("leaf key sequential values multi", () => {
    const delta = new Delta().insert("text").insertEOL();
    const editor = new Editor({ delta });
    const line0 = editor.state.block.getLine(0);
    const leaf0 = line0!.getLeaf(0);
    const key0 = Number(leaf0!.key);
    // [[text 0][\n 1]2] => [[te 0][xt 3][\n 1]2]
    editor.state.apply(new Delta().retain(2).retain(2, { bold: "true" }));
    // [[te 0][xt 3][\n 1]2] => [[text 0][\n 1]2]
    editor.state.apply(new Delta().retain(2).retain(2, { bold: "" }));
    const newLine0 = editor.state.block.getLine(0);
    const newLeaf0 = newLine0!.getLeaf(0);
    const newLeaf1 = newLine0!.getLeaf(1);
    const newKey0 = Number(newLeaf0!.key);
    const newKey1 = Number(newLeaf1!.key);
    expect(newKey0).toBe(key0);
    expect(newKey1).toBe(key0 + 1);
    expect(Number(newLeaf1!.parent.key)).toBe(key0 + 2);
    // [[text 0][\n 1]2] => [[te 0][xt 4][\n 1]2]
    editor.state.apply(new Delta().retain(2).retain(2, { bold: "bold" }));
    const newNewLine0 = editor.state.block.getLine(0);
    const newNewLeaf0 = newNewLine0!.getLeaf(0);
    const newNewLeaf1 = newNewLine0!.getLeaf(1);
    const newNewKey0 = Number(newNewLeaf0!.key);
    const newNewKey1 = Number(newNewLeaf1!.key);
    expect(newNewKey0).toBe(key0);
    expect(newNewKey1).toBe(key0 + 4);
    expect(Number(newLeaf1!.parent.key)).toBe(key0 + 2);
  });
});
