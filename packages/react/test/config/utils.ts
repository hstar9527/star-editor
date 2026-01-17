import type { Editor } from "@block-kit/core";
import { sleep } from "@block-kit/utils";

export const waitRenderComplete = (editor: Editor, sleepMs?: number): Promise<void> => {
  return Promise.all([
    new Promise<void>(resolve => {
      editor.event.once("PAINT", () => resolve());
    }),
    sleep(sleepMs || 0),
  ]) as unknown as Promise<void>;
};
