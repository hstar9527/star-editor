import "../styles/suggest.scss";

import { EDITOR_EVENT, Range, RawRange } from "@block-kit/core";
import { Delta } from "@block-kit/delta";
import type { EventContext } from "@block-kit/utils";
import { cs, KEY_CODE, preventNativeEvent, TRULY } from "@block-kit/utils";
import { useMemoFn } from "@block-kit/utils/dist/es/hooks";
import type { FC } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { preventContextEvent, scrollIfNeeded } from "../../shared/utils/dom";
import { isKeyCode } from "../../shared/utils/is";
import type { SuggestModule } from "../modules/suggest";
import { MENTION_KEY, MENTION_NAME } from "../types";
import { DATA, PANEL_HEIGHT, PANEL_WIDTH } from "../utils/constant";

export const Suggest: FC<{
  top: number;
  left: number;
  text: string;
  controller: SuggestModule;
}> = props => {
  const { controller } = props;
  const editor = controller.editor;
  const ref = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const list = useMemo(() => {
    setActiveIndex(0);
    if (!props.text) return DATA;
    return DATA.filter(it => {
      return it.toUpperCase().includes(props.text.toUpperCase());
    });
  }, [props.text]);

  const onKeydown = useMemoFn((event: KeyboardEvent, context: EventContext) => {
    if (event.isComposing) {
      return void 0;
    }
    if (isKeyCode(event, KEY_CODE.DOWN)) {
      const nextIndex = (activeIndex + 1) % list.length;
      setActiveIndex(nextIndex);
      const container = ref.current;
      const child = container && container.children[nextIndex];
      container && child && scrollIfNeeded(container, child, 5);
      preventContextEvent(event, context);
    }
    if (isKeyCode(event, KEY_CODE.UP)) {
      const prevIndex = (activeIndex - 1 + list.length) % list.length;
      setActiveIndex(prevIndex);
      const container = ref.current;
      const child = container && container.children[prevIndex];
      container && child && scrollIfNeeded(container, child, 5);
      preventContextEvent(event, context);
    }
    if (isKeyCode(event, KEY_CODE.ENTER)) {
      const item = list[activeIndex];
      preventContextEvent(event, context);
      const sel = editor.selection.get();
      if (!item || !sel) return void 0;
      const range = new Range(controller.point, sel.end);
      const raw = RawRange.fromRange(editor, range);
      if (!raw) return void 0;
      const delta = new Delta()
        .retain(raw.start)
        .delete(raw.len)
        .insert(" ", {
          [MENTION_KEY]: TRULY,
          [MENTION_NAME]: item,
        });
      editor.state.apply(delta);
      controller.unmountSuggestPanel();
    }
  });

  useEffect(() => {
    editor.event.on(EDITOR_EVENT.KEY_DOWN, onKeydown, 80);
    return () => {
      editor.event.off(EDITOR_EVENT.KEY_DOWN, onKeydown);
    };
  }, [onKeydown, editor.event]);

  return (
    <div
      ref={ref}
      className="block-kit-suggest-panel"
      style={{ top: props.top, left: props.left, width: PANEL_WIDTH, height: PANEL_HEIGHT }}
      onMouseDown={preventNativeEvent}
    >
      {list.map((it, index) => (
        <div
          key={index}
          className={cs("block-kit-suggest-item", index === activeIndex && "active")}
        >
          {it}
        </div>
      ))}
      {!list.length && <div className="block-kit-suggest-empty">No result</div>}
    </div>
  );
};
