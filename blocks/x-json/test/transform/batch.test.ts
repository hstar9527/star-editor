import type { JSONOp } from "../../src";
import { normalizeBatchOps } from "../../src/utils/transform";

describe("transform batch", () => {
  it("normalize", () => {
    const ops: JSONOp[] = [
      { p: ["a", "b", 1], ld: 1 },
      { p: ["a", "b", 3], ld: 3 },
      { p: ["a", "b", 2], ld: 2 },
      { p: ["a", "b", 3], ld: 3 },
    ];
    const batch = normalizeBatchOps(ops);
    expect(batch[0]).toEqual({ p: ["a", "b", 1], ld: 1 });
    expect(batch[1]).toEqual({ p: ["a", "b", 2], ld: 3 });
    expect(batch[2]).toEqual({ p: ["a", "b", 1], ld: 2 });
    expect(batch[3]).toEqual(undefined);
  });
});
