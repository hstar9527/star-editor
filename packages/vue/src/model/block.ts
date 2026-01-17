import type { BlockState, Editor } from "@block-kit/core";
import type { LineState } from "@block-kit/core";
import {
  BLOCK_ID_KEY,
  BLOCK_KEY,
  EDITOR_EVENT,
  EDITOR_STATE,
  PLACEHOLDER_KEY,
} from "@block-kit/core";
import type { P } from "@block-kit/utils/dist/es/types";
import type { VNode } from "vue";
import {
  computed,
  defineComponent,
  Fragment,
  h,
  onUpdated,
  shallowRef,
  toRaw,
  watch,
  watchEffect,
} from "vue";

import { EDITOR_TO_WRAP_LINE_KEYS, EDITOR_TO_WRAP_LINE_PLUGINS } from "../plugin/modules/wrap";
import type { VueNode, VueWrapLineContext } from "../plugin/types";
import { isStrictEmptyLine } from "../utils/is";
import { JSX_TO_STATE } from "../utils/weak-map";
import { getWrapSymbol } from "../utils/wrapper";
import { LineModel } from "./line";

export type BlockModelProps = {
  editor: Editor;
  state: BlockState;
  placeholder?: string;
};

/**
 * Block Model
 * @param props
 */
export const BlockModel = /*#__PURE__*/ defineComponent<BlockModelProps>({
  name: "BlockModel",
  props: ["editor", "state", "placeholder"],
  setup: props => {
    const flushing = shallowRef(false);
    const lines = shallowRef(props.state.getLines());

    /**
     * 设置行 DOM 节点
     */
    const setModel = (dom: P.Any) => {
      if (dom instanceof HTMLDivElement) {
        props.editor.model.setBlockModel(dom, toRaw(props.state));
      }
    };

    /**
     * 数据同步变更, 异步批量绘制变更
     */
    const onContentChange = () => {
      // 举个例子: 同步等待刷新的队列 => ||||||||
      // 进入更新行为后, 异步行为等待, 同步的队列由于 !flushing 全部被守卫
      // 主线程执行完毕后, 异步队列开始执行, 此时拿到的是最新数据, 以此批量重新渲染
      if (flushing.value) return void 0;
      flushing.value = true;
      Promise.resolve().then(() => {
        flushing.value = false;
        lines.value = props.state.getLines();
        props.editor.state.set(EDITOR_STATE.PAINTING, true);
      });
    };

    /**
     * 监听内容变更事件, 更新当前块视图
     */
    watchEffect(onCleanup => {
      props.editor.event.on(EDITOR_EVENT.CONTENT_CHANGE, onContentChange);
      onCleanup(() => {
        props.editor.event.off(EDITOR_EVENT.CONTENT_CHANGE, onContentChange);
      });
    });

    /**
     * 视图更新需要重新设置选区
     */
    watch(
      () => lines.value,
      () => {
        const selection = props.editor.selection.get();
        if (
          !props.editor.state.get(EDITOR_STATE.COMPOSING) &&
          props.editor.state.get(EDITOR_STATE.FOCUS) &&
          selection
        ) {
          // 更新浏览器选区
          props.editor.logger.debug("UpdateDOMSelection");
          props.editor.selection.updateDOMSelection(true);
        }
      },
      { flush: "post" }
    );

    /**
     * 视图更新需要触发视图绘制完成事件 无依赖数组
     * state  -> parent -> node -> child ->|
     * effect <- parent <- node <- child <-|
     */
    onUpdated(async () => {
      props.editor.logger.debug("OnPaint");
      props.editor.state.set(EDITOR_STATE.PAINTING, false);
      Promise.resolve().then(() => {
        props.editor.event.trigger(EDITOR_EVENT.PAINT, {});
      });
    });

    /**
     * 处理行节点
     */
    const elements = computed(() => {
      // 此处取原始值, 可以避免 Vue 进行深度代理
      // 已实现 immutable, 仅需要处理顶层引用类型
      // https://cn.vuejs.org/guide/best-practices/performance
      const rawLines = toRaw(lines.value);
      return rawLines.map((line, index) => {
        const node = h(LineModel, {
          key: line.key,
          editor: props.editor,
          lineState: line,
          index: index,
        });
        JSX_TO_STATE.set(node, line);
        return node;
      });
    });

    /**
     * 将行包装组合 O(N)
     */
    const children = computed((): VNode[] => {
      const wrapped: VNode[] = [];
      const keys = EDITOR_TO_WRAP_LINE_KEYS.get(props.editor);
      const plugins = EDITOR_TO_WRAP_LINE_PLUGINS.get(props.editor);
      if (!keys || !plugins) return elements.value;
      const len = elements.value.length;
      for (let i = 0; i < len; ++i) {
        const element = elements.value[i];
        const symbol = getWrapSymbol(keys, element);
        const line = JSX_TO_STATE.get(element) as LineState;
        if (!element || !line || !symbol) {
          wrapped.push(element);
          continue;
        }
        // 执行到此处说明需要包装相关节点(即使仅单个节点)
        const nodes: VNode[] = [element];
        for (let k = i + 1; k < len; ++k) {
          const next = elements.value[k];
          const nextSymbol = getWrapSymbol(keys, next);
          if (!next || !nextSymbol || nextSymbol !== symbol) {
            // 回退到上一个值, 以便下次循环时重新检查
            i = k - 1;
            break;
          }
          nodes.push(next);
          i = k;
        }
        // 通过插件渲染包装节点
        let wrapper: VueNode = nodes;
        const op = line.op;
        for (const plugin of plugins) {
          // 这里的状态以首个节点为准
          const context: VueWrapLineContext = {
            lineState: line,
            children: wrapper,
          };
          if (plugin.match(line.op.attributes || {}, op) && plugin.wrapLine) {
            wrapper = plugin.wrapLine(context);
          }
        }
        const key = `${i - nodes.length + 1}-${i}`;
        wrapped.push(h(Fragment, { key }, [wrapper]));
      }
      return wrapped;
    });

    return () => {
      return h(
        "div",
        {
          [BLOCK_KEY]: true,
          [BLOCK_ID_KEY]: props.state.key,
          ref: setModel,
        },
        [
          props.placeholder &&
            lines.value.length === 1 &&
            isStrictEmptyLine(lines.value[0]) &&
            h(
              "div",
              {
                [PLACEHOLDER_KEY]: true,
                style: {
                  position: "absolute",
                  opacity: "0.3",
                  userSelect: "none",
                  pointerEvents: "none",
                },
              },
              props.placeholder
            ),
          children.value,
        ]
      );
    };
  },
});
