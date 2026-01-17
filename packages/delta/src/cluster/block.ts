import { ROOT_BLOCK } from "@block-kit/utils";

import { Delta } from "../delta/delta";
import { cloneOps } from "../utils/clone";
import type { BlockOption } from "./interface";
import { BLOCK_TYPE } from "./interface";

export class Block extends Delta {
  /** 块 id 标识 */
  public readonly id: string;
  /** 块类型 */
  public readonly type: string;

  /**
   * 构造函数
   * @param options
   */
  constructor(options?: BlockOption) {
    const { ops, id, type } = options || {};
    super(ops || []);
    this.id = id || ROOT_BLOCK;
    this.type = type || BLOCK_TYPE.C;
  }

  /**
   * 切片
   * @param start
   * @param end
   * @returns
   */
  public slice(start = 0, end = Infinity): Block {
    const delta = super.slice(start, end);
    return Block.create(this, delta);
  }

  /**
   * 组合
   * @param other
   * @returns
   */
  public compose(other: Delta): Block {
    const delta = super.compose(other);
    return Block.create(this, delta);
  }

  /**
   * 连接
   * @param other
   */
  public concat(other: Delta): Block {
    const delta = super.concat(other);
    return Block.create(this, delta);
  }

  /**
   * 反转
   * @param base
   */
  public invert(base: Delta): Block {
    const delta = super.invert(base);
    return Block.create(this, delta);
  }

  /**
   * 变换
   * @param delta
   * @param priority
   */
  public transform(base: Delta, priority = false): Delta {
    const delta = super.transform(base, priority);
    return Block.create(this, delta);
  }

  /**
   * 变换位置
   * @param index
   * @param priority
   */
  public transformPosition(base: number, priority = false): number {
    const index = super.transformPosition(base, priority);
    return index;
  }

  /**
   * 以 base 和 delta 为基础创建新的 Block
   * @param base
   * @param delta
   */
  public static create(base: Block, delta: Delta) {
    const { ops } = delta;
    const { id: blockId, type: blockType } = base;
    return new Block({ ops, id: blockId, type: blockType });
  }

  /**
   * 克隆 Block
   * @param [deep?=undef] 是否深克隆
   */
  public clone(deep?: boolean): Block {
    return new Block({
      id: this.id,
      type: this.type,
      ops: deep ? cloneOps(this.ops) : this.ops,
    });
  }
}
