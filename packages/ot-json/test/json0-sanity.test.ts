import type { Op } from "../src";
import { json } from "../src";

describe("sanity", () => {
  describe("#create()", () => {
    it("returns null", () => {
      expect(json.create(null)).toBe(null);
    });
  });

  describe("#compose()", () => {
    it("od,oi --> od+oi", () => {
      expect(json.compose([{ p: ["foo"], od: 1 }], [{ p: ["foo"], oi: 2 }])).toEqual([
        { p: ["foo"], od: 1, oi: 2 },
      ]);
      expect(json.compose([{ p: ["foo"], od: 1 }], [{ p: ["bar"], oi: 2 }])).toEqual([
        { p: ["foo"], od: 1 },
        { p: ["bar"], oi: 2 },
      ]);
    });

    it("merges od+oi, od+oi -> od+oi", () => {
      expect(json.compose([{ p: ["foo"], od: 1, oi: 3 }], [{ p: ["foo"], od: 3, oi: 2 }])).toEqual([
        { p: ["foo"], od: 1, oi: 2 },
      ]);
    });
  });

  describe("#transform()", () => {
    it("returns sane values", () => {
      const t = (op1: Op[], op2: Op[]) => {
        expect(json.transform(op1, op2, "left")).toEqual(op1);
        expect(json.transform(op1, op2, "right")).toEqual(op1);
      };

      t([], []);
      t([{ p: ["foo"], oi: 1 }], []);
      t([{ p: ["foo"], oi: 1 }], [{ p: ["bar"], oi: 2 }]);
    });
  });
});
