import { EDITOR_KEY, Point, Range } from "@block-kit/core";
import { cs } from "@block-kit/utils";
import { defineComponent, h, onMounted, onUnmounted, shallowRef } from "vue";

import { useEditorStatic } from "../hooks/use-editor";
import { useReadonly } from "../hooks/use-readonly";
import { BlockModel } from "../model/block";

export type EditableProps = {
  /** 节点类名 */
  className?: string;
  /** 自动聚焦 */
  autoFocus?: boolean;
  /**
   * 占位节点
   * - 节点会脱离文档流, 需要注意 CSS 布局
   */
  placeholder?: string;
};

/**
 * 编辑节点
 * @param props
 */
export const Editable = /*#__PURE__*/ defineComponent<EditableProps>({
  name: "Editable",
  props: ["className", "autoFocus", "placeholder"],
  setup: props => {
    const { editor } = useEditorStatic();
    const { readonly } = useReadonly();
    const container = shallowRef<HTMLDivElement | null>(null);

    onMounted(() => {
      const el = container.value;
      el && editor.mount(el);
      // COMPAT: 这里有个奇怪的表现
      // 当自动聚焦时, 必须要先更新浏览器选区再聚焦
      // 否则会造成立即按下回车时, 光标不会跟随选区移动
      // 无论是 Model 选区还是浏览器选区, 都已经更新但是却不移动
      if (props.autoFocus) {
        const start = new Point(0, 0);
        editor.selection.set(new Range(start, start), true);
        editor.selection.focus();
      }
    });

    onUnmounted(() => {
      editor.destroy();
    });

    return () =>
      h(
        "div",
        {
          ref: container,
          class: cs(props.className, "notranslate"),
          [EDITOR_KEY]: true,
          contentEditable: !readonly,
          style: {
            outline: "none",
            position: "relative",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            overflowWrap: "break-word",
          },
        },
        h(BlockModel, {
          editor,
          state: editor.state.block,
          placeholder: props.placeholder,
        })
      );
  },
});
