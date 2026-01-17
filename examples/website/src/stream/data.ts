export const MARKDOWN = `# 测试文档

初始多行文本内容
初始多行文本内容
初始多行文本内容

## 二级标题
**加粗文本** *斜体文本* ~~删除线~~

### 三级标题

- 无序列表项1
   - 无序列表项1.1
   - 无序列表项1.2
- 无序列表项2

### 三级标题

> 1. 有序列表A
> 2. 有序列表B

\`行内代码\` 和 [链接](https://example.com)
`;

export const getReadableMarkdown = () => {
  let start = 0;
  const options: UnderlyingDefaultSource<string> = {
    start(controller) {
      const interval = setInterval(() => {
        const slice = Math.floor(Math.random() * 2) + 1;
        const end = start + slice;
        const fragment = MARKDOWN.slice(start, end).replace(/\n/g, "\\n");
        controller.enqueue(fragment);
        start = end;
        if (start >= MARKDOWN.length) {
          clearInterval(interval);
          controller.close();
        }
      }, 50);
    },
  };
  const readable = new ReadableStream<string>(options);
  return readable;
};
