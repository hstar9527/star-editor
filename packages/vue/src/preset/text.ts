import { LEAF_STRING } from "@block-kit/core";
import { isDOMText } from "@block-kit/utils";
import { defineComponent, h, shallowRef } from "vue";

export type TextProps = {
  text: string;
};

/**
 * 文本节点
 * @param props
 */
export const Text = /*#__PURE__*/ defineComponent<TextProps>({
  name: "Text",
  props: ["text"],
  setup: (props, { expose }) => {
    const container = shallowRef<HTMLSpanElement | null>(null);

    const onRef = (dom: HTMLSpanElement | null) => {
      // COMPAT: 避免 Vue 非受控与 IME 造成的 DOM 内容问题
      if (!dom || props.text === dom.textContent) return void 0;
      const nodes = dom.childNodes;
      // If the text content is inconsistent due to the modification of the input
      // it needs to be corrected
      for (let i = 1; i < nodes.length; ++i) {
        const node = nodes[i];
        node && node.remove();
      }
      // Guaranteed to have only one text child
      if (isDOMText(dom.firstChild)) {
        dom.firstChild.nodeValue = props.text;
      }
    };

    // 处理外部引用的 ref
    expose({ el: container });

    return () =>
      h(
        "span",
        {
          ref: el => {
            if (el instanceof HTMLSpanElement === false) return void 0;
            container.value = el;
            onRef(el);
          },
          [LEAF_STRING]: true,
        },
        props.text
      );
  },
});
