import "./index.scss";
import "@arco-design/web-react/es/style/index.less";

import { Button, Input } from "@arco-design/web-react";
import { IconGithub } from "@arco-design/web-react/icon";
import { Editor, LOG_LEVEL } from "@block-kit/core";
import { Delta } from "@block-kit/delta";
import {
  BoldPlugin,
  BulletListPlugin,
  DividerPlugin,
  HeadingPlugin,
  IndentPlugin,
  InlineCodePlugin,
  ItalicPlugin,
  LineHeightPlugin,
  LinkPlugin,
  OrderListPlugin,
  QuotePlugin,
  StrikePlugin,
  UnderlinePlugin,
} from "@block-kit/plugin";
import { BlockKit, Editable } from "@block-kit/react";
import { DeltaComposer, MdComposer } from "@block-kit/stream";
import { cs } from "@block-kit/utils";
import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";

import { SCHEMA } from "../react/config/schema";
import { getReadableMarkdown, MARKDOWN } from "./data";

const App: FC = () => {
  const [disableBoot, setDisableBoot] = useState(false);

  const editor = useMemo(() => {
    const instance = new Editor({ schema: SCHEMA, logLevel: LOG_LEVEL.ERROR });
    instance.plugin.register([
      new BoldPlugin(),
      new ItalicPlugin(),
      new UnderlinePlugin(instance),
      new StrikePlugin(instance),
      new InlineCodePlugin(instance),
      new HeadingPlugin(instance),
      new LineHeightPlugin(instance),
      new DividerPlugin(instance),
      new BulletListPlugin(instance),
      new OrderListPlugin(instance),
      new IndentPlugin(instance),
      new LinkPlugin(instance),
      new QuotePlugin(instance),
    ]);
    return instance;
  }, []);

  useEffect(() => {
    // @ts-expect-error 仅调试用
    window.editor = editor;
    // @ts-expect-error 仅调试用
    window.Delta = Delta;
  }, [editor]);

  const onStart = () => {
    setDisableBoot(true);
    editor.state.setContent(new Delta());
    const readable = getReadableMarkdown();
    const reader = readable.getReader();
    const dc = new DeltaComposer();
    const ms = new MdComposer(dc);
    const start = async () => {
      const { done, value } = await reader.read();
      if (done) {
        console.log("解析完成");
        setDisableBoot(false);
        return;
      }
      const text = value.replace(/\\n/g, "\n");
      const diff = ms.compose(text);
      console.log("SSE TEXT:", JSON.stringify(text), diff.ops);
      editor.state.apply(diff);
      start();
    };
    start();
  };

  return (
    <div className="stream-markdown-container-wrapper">
      <div className="stream-markdown-title">流式 Markdown 增量富文本解析算法</div>
      <div className="stream-markdown-container">
        <div className="stream-markdown-content">
          <Input.TextArea readOnly value={MARKDOWN}></Input.TextArea>
        </div>
        <Button
          className="stream-markdown-exec"
          disabled={disableBoot}
          type="primary"
          onClick={onStart}
        >
          执行 &gt;
        </Button>
        <div className="stream-markdown-editor">
          <BlockKit editor={editor} readonly={disableBoot}>
            <Editable placeholder="Please Enter..." className="block-kit-editable"></Editable>
          </BlockKit>
        </div>
      </div>
      <a
        className={cs("github-link")}
        href="https://github.com/WindRunnerMax/BlockKit/tree/master/examples/stream"
        target="_blank"
      >
        <IconGithub />
      </a>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
