import { Block } from "./block";
import type { BlockSetOption } from "./interface";

export class BlockSet {
  /** 内建值 */
  protected _blocks: Record<string, Block>;

  /**
   * 构造函数
   * @param blocks
   */
  constructor(blocks: BlockSetOption = {}) {
    this._blocks = {};
    Object.entries(blocks).forEach(([id, block]) => {
      this._blocks[id] = new Block({ ...block, id });
    });
  }

  /**
   * 获取块集合
   */
  public get blocks() {
    return this._blocks;
  }

  /**
   * 获取指定块
   * @param blockId
   */
  public get(blockId: string): Block | null {
    return this._blocks[blockId] || null;
  }

  /**
   * 删除指定块
   * @param blockId
   */
  public delete(blockId: string): this {
    delete this._blocks[blockId];
    return this;
  }

  /**
   * 增加块
   * @param block
   */
  public add(block: Block): this {
    this._blocks[block.id] = block;
    return this;
  }

  /**
   * 将 id 指向的块替换为新的块
   * @param id 被替换的块 id
   * @param block 新置入的块
   */
  public replace(id: string, block: Block): this {
    return this.delete(id).add(block);
  }

  /**
   * 遍历块
   * @param cb
   */
  public forEach(cb: (blockId: string, block: Block) => void) {
    for (const [blockId, block] of Object.entries(this._blocks)) {
      cb(blockId, block);
    }
  }

  /**
   * 克隆对象
   * @param deep [?=undef] 是否深拷贝
   */
  public clone(deep?: boolean): BlockSet {
    const newBlockSet = new BlockSet();
    this.forEach((_, delta) => {
      newBlockSet.add(delta.clone(deep));
    });
    return newBlockSet;
  }
}
