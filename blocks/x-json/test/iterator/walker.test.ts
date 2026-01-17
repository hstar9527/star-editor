import type { Block, Blocks } from "../../src/types/block";
import { createBlockTreeWalker, createBlockTreeWalkerBFS } from "../../src/utils/walker";

const blocks: Blocks = {
  root: {
    id: "root",
    version: 1,
    data: { type: "ROOT", children: ["child1", "child2"], parent: "" },
  },
  child1: {
    id: "child1",
    version: 1,
    data: { type: "text", children: ["grandchild1"], delta: [], parent: "root" },
  },
  child2: {
    id: "child2",
    version: 1,
    data: { type: "text", children: [], delta: [], parent: "root" },
  },
  grandchild1: {
    id: "grandchild1",
    version: 1,
    data: { type: "text", children: [], delta: [], parent: "child1" },
  },
};

describe("iterator walker", () => {
  it("create block tree walker dfs", () => {
    const walker = createBlockTreeWalker(blocks, "root");
    expect(walker.nextNode()).toBe(blocks.root);
    expect(walker.nextNode()).toBe(blocks.child1);
    expect(walker.nextNode()).toBe(blocks.grandchild1);
    expect(walker.nextNode()).toBe(blocks.child2);
    expect(walker.nextNode()).toBe(null);
  });

  it("create block tree walker dfs iterator", () => {
    const walker = createBlockTreeWalker(blocks, "root");
    const target: Block[] = [];
    for (const node of walker) {
      target.push(node);
    }
    const children = [blocks.root, blocks.child1, blocks.grandchild1, blocks.child2];
    expect(target).toEqual(children);
  });

  it("create block tree walker dfs iterator2", () => {
    const walker = createBlockTreeWalker(blocks, "root");
    const children = [blocks.root, blocks.child1, blocks.grandchild1, blocks.child2];
    expect([...walker]).toEqual(children);
  });

  it("create block tree walker bfs", () => {
    const walker = createBlockTreeWalkerBFS(blocks, "root");
    expect(walker.nextNode()).toBe(blocks.root);
    expect(walker.nextNode()).toBe(blocks.child1);
    expect(walker.nextNode()).toBe(blocks.child2);
    expect(walker.nextNode()).toBe(blocks.grandchild1);
    expect(walker.nextNode()).toBe(null);
  });

  it("create block tree walker bfs iterator", () => {
    const walker = createBlockTreeWalkerBFS(blocks, "root");
    const target: Block[] = [];
    for (const node of walker) {
      target.push(node);
    }
    const children = [blocks.root, blocks.child1, blocks.child2, blocks.grandchild1];
    expect(target).toEqual(children);
  });

  it("create block tree walker bfs iterator2", () => {
    const walker = createBlockTreeWalkerBFS(blocks, "root");
    const children = [blocks.root, blocks.child1, blocks.child2, blocks.grandchild1];
    expect([...walker]).toEqual(children);
  });
});
