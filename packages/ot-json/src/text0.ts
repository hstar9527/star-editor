import { isArray, isNil } from "@block-kit/utils";
import type { P } from "@block-kit/utils/dist/es/types";

import type { Side, TextOp } from "./types";
import { SIDE } from "./utils";

/**
 * OT Text0
 * - https://github.com/ottypes/docs
 * - https://github.com/share/sharedb
 * - https://github.com/ottypes/json0
 */
export class TextType {
  public readonly name = "text0";

  public create(initial: string) {
    if (!isNil(initial) && typeof initial !== "string") {
      throw new Error("Initial data must be a string");
    }
    return initial || "";
  }

  public compose(op1: TextOp[], op2: TextOp[]) {
    const text0 = TextType.prototype;
    text0.checkValidOps(op1);
    text0.checkValidOps(op2);
    const newOp = op1.slice();
    for (let i = 0; i < op2.length; i++) {
      text0.append(newOp, op2[i]);
    }
    return newOp;
  }

  public invert(ops: TextOp[]) {
    const text0 = TextType.prototype;
    // Shallow copy & reverse that sucka.
    ops = ops.slice().reverse();
    for (let i = 0; i < ops.length; i++) {
      ops[i] = text0.invertComponent(ops[i]);
    }
    return ops;
  }

  public apply(snapshot: string, ops: TextOp[]) {
    const text0 = TextType.prototype;
    let deleted;

    const type = typeof snapshot;
    if (type !== "string") {
      throw new Error("text0 operations cannot be applied to type: " + type);
    }

    text0.checkValidOps(ops);
    for (let i = 0; i < ops.length; i++) {
      const component = ops[i];
      if (!isNil(component.i)) {
        snapshot = text0.strInject(snapshot, component.p, component.i);
      } else {
        deleted = snapshot.slice(component.p, component.p + component.d!.length);
        if (component.d !== deleted) {
          throw new Error(
            "Delete component '" + component.d + "' does not match deleted text '" + deleted + "'"
          );
        }
        snapshot =
          snapshot.slice(0, component.p) + snapshot.slice(component.p + component.d.length);
      }
    }
    return snapshot;
  }

  public transform(op: TextOp, otherOp: TextOp, side?: Side): TextOp | P.Undef;
  public transform(op: TextOp[], otherOp: TextOp[], side?: Side): TextOp[] | P.Undef;
  public transform(
    op: TextOp | TextOp[],
    otherOp: TextOp | TextOp[],
    side?: Side
  ): TextOp | TextOp[] | P.Undef {
    const text0 = TextType.prototype;
    if (isArray(op) && isArray(otherOp)) {
      if (otherOp.length === 0) return op;
      if (op.length === 1 && otherOp.length === 1)
        return text0.transformComponent([], op[0], otherOp[0], side);
      if (side === SIDE.LEFT) {
        return text0.transformX(op, otherOp)[0];
      } else {
        return text0.transformX(otherOp, op)[1];
      }
    }
    const dest = text0.transformComponent([], op as TextOp, otherOp as TextOp, side);
    return dest[0];
  }

  /**
   * Helper method to transform a cursor position as a result of an op.
   * Like transformPosition above, if c is an insert, insertAfter specifies
   * whether the cursor position is pushed after an insert (true) or before it
   * (false).
   */
  public transformCursor(position: number, ops: TextOp[], side?: Side) {
    const text0 = TextType.prototype;
    const insertAfter = side === "right";
    for (let i = 0; i < ops.length; i++) {
      position = text0.transformPosition(position, ops[i], insertAfter);
    }
    return position;
  }

  public normalize(op: TextOp[] | TextOp) {
    const text0 = TextType.prototype;
    const newOp: TextOp[] = [];
    // Normalize should allow ops which are a single (unwrapped) component:
    // {i:'asdf', p:23}.
    // There's no good way to test if something is an array:
    // http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
    // so this is probably the least bad solution.
    const ops = isArray(op) ? op : [op];

    for (let i = 0; i < ops.length; i++) {
      const c = ops[i];
      if (isNil(c.p)) c.p = 0;
      text0.append(newOp, c);
    }

    return newOp;
  }

  /**
   * Insert s2 into s1 at pos.
   */
  private strInject(s1: string, pos: number, s2: string) {
    return s1.slice(0, pos) + s2 + s1.slice(pos);
  }

  /**
   * Check that an operation component is valid. Throws if its invalid.
   */
  private checkValidComponent(c: TextOp) {
    if (typeof c.p !== "number") {
      throw new Error("component missing position field");
    }
    if (typeof c.i !== "string" && typeof c.d !== "string") {
      throw new Error("component needs an i or d field");
    }
    if (c.p < 0) {
      throw new Error("position cannot be negative");
    }
  }

  /**
   * Check that an operation is valid
   */
  private checkValidOps(ops: TextOp[]) {
    for (let i = 0; i < ops.length; i++) {
      this.checkValidComponent(ops[i]);
    }
  }

  /**
   * Append a component to the end of newOp. Exported for use by the random op
   * generator and the JSON0 type.
   */
  private append(newOp: TextOp[], c: TextOp) {
    if (c.i === "" || c.d === "") return;

    if (newOp.length === 0) {
      newOp.push(c);
    } else {
      const last = newOp[newOp.length - 1];

      if (last.i != null && c.i != null && last.p <= c.p && c.p <= last.p + last.i.length) {
        // Compose the insert into the previous insert
        newOp[newOp.length - 1] = { i: this.strInject(last.i, c.p - last.p, c.i), p: last.p };
      } else if (last.d != null && c.d != null && c.p <= last.p && last.p <= c.p + c.d.length) {
        // Compose the deletes together
        newOp[newOp.length - 1] = { d: this.strInject(c.d, last.p - c.p, last.d), p: c.p };
      } else {
        newOp.push(c);
      }
    }
  }

  /**
   * This helper method transforms a position by an op component.
   *
   * If c is an insert, insertAfter specifies whether the transform
   * is pushed after the insert (true) or before it (false).
   *
   * insertAfter is optional for deletes.
   */
  private transformPosition(pos: number, c: TextOp, insertAfter?: boolean) {
    // This will get collapsed into a giant ternary by uglify.
    if (!isNil(c.i)) {
      if (c.p < pos || (c.p === pos && insertAfter)) {
        return pos + c.i.length;
      } else {
        return pos;
      }
    } else {
      // I think this could also be written as: Math.min(c.p, Math.min(c.p -
      // otherC.p, otherC.d.length)) but I think its harder to read that way, and
      // it compiles using ternary operators anyway so its no slower written like
      // this.
      if (pos <= c.p) {
        return pos;
      } else if (pos <= c.p + c.d!.length) {
        return c.p;
      } else {
        return pos - c.d!.length;
      }
    }
  }

  private invertComponent(c: TextOp) {
    return c.i != null ? { d: c.i, p: c.p } : { i: c.d, p: c.p };
  }

  private transformComponent(dest: TextOp[], c: TextOp, otherC: TextOp, side: Side = SIDE.LEFT) {
    //var cIntersect, intersectEnd, intersectStart, newC, otherIntersect, s;

    this.checkValidComponent(c);
    this.checkValidComponent(otherC);

    if (c.i != null) {
      // Insert.
      this.append(dest, { i: c.i, p: this.transformPosition(c.p, otherC, side === SIDE.RIGHT) });
    } else {
      // Delete
      if (otherC.i != null) {
        // Delete vs insert
        let s = c.d;
        if (c.p < otherC.p) {
          this.append(dest, { d: s!.slice(0, otherC.p - c.p), p: c.p });
          s = s!.slice(otherC.p - c.p);
        }
        if (s !== "") this.append(dest, { d: s, p: c.p + otherC.i.length });
      } else {
        // Delete vs delete
        if (c.p >= otherC.p + otherC.d!.length)
          this.append(dest, { d: c.d, p: c.p - otherC.d!.length });
        else if (c.p + c.d!.length <= otherC.p) this.append(dest, c);
        else {
          // They overlap somewhere.
          const newC = { d: "", p: c.p };

          if (c.p < otherC.p) newC.d = c.d!.slice(0, otherC.p - c.p);

          if (c.p + c.d!.length > otherC.p + otherC.d!.length)
            newC.d += c.d!.slice(otherC.p + otherC.d!.length - c.p);

          // This is entirely optional - I'm just checking the deleted text in
          // the two ops matches
          const intersectStart = Math.max(c.p, otherC.p);
          const intersectEnd = Math.min(c.p + c.d!.length, otherC.p + otherC.d!.length);
          const cIntersect = c.d!.slice(intersectStart - c.p, intersectEnd - c.p);
          const otherIntersect = otherC.d!.slice(
            intersectStart - otherC.p,
            intersectEnd - otherC.p
          );
          if (cIntersect !== otherIntersect) {
            throw new Error("Delete ops delete different text in the same region of the document");
          }
          if (newC.d !== "") {
            newC.p = this.transformPosition(newC.p, otherC);
            this.append(dest, newC);
          }
        }
      }
    }

    return dest;
  }

  private transformComponentX(
    left: TextOp,
    right: TextOp,
    destLeft: TextOp[],
    destRight: TextOp[]
  ) {
    this.transformComponent(destLeft, left, right, "left");
    this.transformComponent(destRight, right, left, "right");
  }

  private transformX(leftOps: TextOp[], rightOps: TextOp[]) {
    this.checkValidOps(leftOps);
    this.checkValidOps(rightOps);
    const newRightOps: TextOp[] = [];

    for (let i = 0; i < rightOps.length; i++) {
      let rightComponent: TextOp | null = rightOps[i];

      // Generate newLeftOp by composing leftOp by rightComponent
      const newLeftOps: TextOp[] = [];
      let k = 0;
      while (k < leftOps.length) {
        const nextOps: TextOp[] = [];
        this.transformComponentX(leftOps[k], rightComponent, newLeftOps, nextOps);
        k++;

        if (nextOps.length === 1) {
          rightComponent = nextOps[0];
        } else if (nextOps.length === 0) {
          for (let j = k; j < leftOps.length; j++) {
            this.append(newLeftOps, leftOps[j]);
          }
          rightComponent = null;
          break;
        } else {
          // Recurse.
          const pair = this.transformX(leftOps.slice(k), nextOps);
          for (let l = 0; l < pair[0].length; l++) {
            this.append(newLeftOps, pair[0][l]);
          }
          for (let r = 0; r < pair[1].length; r++) {
            this.append(newRightOps, pair[1][r]);
          }
          rightComponent = null;
          break;
        }
      }

      if (!isNil(rightComponent)) {
        this.append(newRightOps, rightComponent);
      }
      leftOps = newLeftOps;
    }
    return [leftOps, newRightOps];
  }
}
