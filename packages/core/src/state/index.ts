import { Delta } from "@block-kit/delta";
import { getId } from "@block-kit/utils";

import type { Editor } from "../editor";
import type { ContentChangeEvent } from "../event/bus/";
import { EDITOR_EVENT } from "../event/bus/";
import { Range } from "../selection/modules/range";
import { RawRange } from "../selection/modules/raw-range";
import { BlockState } from "./modules/block-state";
import { Mutate } from "./mutate";
import type { ApplyOptions, ApplyResult } from "./types";
import { APPLY_SOURCE, EDITOR_STATE } from "./types";
import { normalizeDelta, removeLastEOL } from "./utils/normalize";

export class EditorState {
  /** Delta 缓存 */
  protected _delta: Delta | null;
  /** BlockState 引用 */
  public block: BlockState;
  /** 内建状态集合 */
  protected status: Record<string, boolean>;

  /**
   * 构造函数
   * @param editor
   * @param delta
   */
  constructor(protected editor: Editor, delta: Delta) {
    this.status = {};
    this._delta = delta;
    this.block = new BlockState(editor, delta);
  }

  /**
   * 获取编辑器状态
   * @param key
   */
  public get(key: keyof typeof EDITOR_STATE) {
    return this.status[key];
  }

  /**
   * 设置编辑器状态
   * @param key
   * @param value
   */
  public set(key: keyof typeof EDITOR_STATE, value: boolean) {
    this.status[key] = value;
    return this;
  }

  /**
   * 判断焦点是否在编辑器内
   */
  public isFocused() {
    return !!this.get(EDITOR_STATE.FOCUS);
  }

  /**
   * 判断编辑器是否只读
   */
  public isReadonly() {
    return !!this.get(EDITOR_STATE.READONLY);
  }

  /**
   * 判断编辑器是否正在组合输入
   */
  public isComposing() {
    return !!this.get(EDITOR_STATE.COMPOSING);
  }

  /**
   * 转换为 Block Delta
   * - 以内建状态为主, Block 数据按需转换
   * @param deep [?=undef] 深拷贝
   */
  public toBlock(deep?: boolean) {
    if (!deep && this._delta) {
      return this._delta;
    }
    const delta = this.block.toDelta(deep);
    this._delta = delta;
    return delta;
  }

  /**
   * 主动设置编辑器内容
   * @param delta
   */
  public setContent(delta: Delta) {
    const len = this.block.length - 1;
    const newDelta = new Delta().delete(len).concat(removeLastEOL(delta));
    this.apply(newDelta, { undoable: false });
    this.editor.history.clear();
    return this;
  }

  /**
   * 应用编辑器变更
   * @param delta
   * @param options
   */
  public apply(delta: Delta, options: ApplyOptions = {}): ApplyResult {
    const { source = APPLY_SOURCE.USER, autoCaret = true, preventNormalize } = options;
    const previous = this.toBlock();
    this._delta = null;
    const selection = this.editor.selection;
    // 需要先标准化 Delta, 否则可能导致协同一致性问题
    const normalized = preventNormalize ? delta : normalizeDelta(this.editor, delta);

    // 获取当前选区位置
    const raw: RawRange | null = autoCaret ? options.range || selection.toRaw() : null;
    this.editor.event.trigger(EDITOR_EVENT.CONTENT_WILL_CHANGE, {
      options,
      current: previous,
      source: source,
      changes: normalized,
      extra: options.extra,
    });

    // 更新 BlockSet Model
    const mutate = new Mutate(this.block);
    const newLines = mutate.compose(normalized);
    this.block.updateLines(newLines);

    // 更新选区位置
    if (autoCaret && raw) {
      const start = normalized.transformPosition(raw.start);
      const end = raw.len ? normalized.transformPosition(raw.start + raw.len) : start;
      const range = Range.fromRaw(this.editor, new RawRange(start, end - start));
      this.editor.selection.set(range);
    }

    const id = getId(6);
    const current = this.toBlock();
    const payload: ContentChangeEvent = {
      id: id,
      options,
      previous: previous,
      current: current,
      source: source,
      changes: normalized,
      inserts: mutate.inserts,
      revises: mutate.revises,
      deletes: mutate.deletes,
      extra: options.extra,
    };
    this.editor.logger.debug("Editor Content Change", payload);
    this.editor.event.trigger(EDITOR_EVENT.CONTENT_CHANGE, payload);
    return { id };
  }
}
