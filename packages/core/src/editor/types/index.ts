import type { Delta } from "@block-kit/delta";
import type { O } from "@block-kit/utils/dist/es/types";

import type { Clipboard } from "../../clipboard";
import type { Command } from "../../command";
import type { Event } from "../../event";
import type { History } from "../../history";
import type { Input } from "../../input";
import type { LOG_LEVEL, Logger } from "../../log";
import type { Lookup } from "../../lookup";
import type { Model } from "../../model";
import type { Perform } from "../../perform";
import type { Plugin } from "../../plugin";
import type { Rect } from "../../rect";
import type { Schema } from "../../schema";
import type { EditorSchema } from "../../schema/types";
import type { Selection } from "../../selection";
import type { EditorState } from "../../state";
import type { Tracer } from "../../tracer";

export type EditorOptions = {
  /** 初始渲染数据 */
  delta?: Delta;
  /** 预设渲染规则 */
  schema?: EditorSchema;
  /** 日志等级 */
  logLevel?: O.Values<typeof LOG_LEVEL>;
  /** 外部模块重写 */
  modules?: {
    /** 配置模块 */
    Schema?: typeof Schema;
    /** 事件模块 */
    Event?: typeof Event;
    /** 模型映射 */
    Model?: typeof Model;
    /** 输入模块 */
    Input?: typeof Input;
    /** 日志模块 */
    Logger?: typeof Logger;
    /** 插件模块 */
    Plugin?: typeof Plugin;
    /** 状态模块 */
    State?: typeof EditorState;
    /** 选区模块 */
    Selection?: typeof Selection;
    /** 历史模块 */
    History?: typeof History;
    /** 剪贴板模块 */
    Clipboard?: typeof Clipboard;
    /** 执行模块 */
    Perform?: typeof Perform;
    /** 命令模块 */
    Command?: typeof Command;
    /** 追踪模块 */
    Tracer?: typeof Tracer;
    /** 检索模块 */
    Lookup?: typeof Lookup;
    /** 位置模块 */
    Rect?: typeof Rect;
  };
};
