/// <reference types="../../../utils/src/global.d.ts" />
import { sleep } from "@block-kit/utils";
import { act, render } from "@testing-library/react";
import type { Dispatch, SetStateAction } from "react";

import { useMemoFn, useSafeState } from "../../../utils/src/hooks";

describe("hooks callback", () => {
  it("memo fn", async () => {
    const spy = jest.fn(v => v);
    let callerCount = 0;
    let setCount!: Dispatch<SetStateAction<number>>;
    const App = () => {
      const [count, _setCount] = useSafeState(0);
      setCount = _setCount;
      const fn = useMemoFn(() => {
        callerCount = spy(count);
      });
      return (
        <div data-count onClick={fn}>
          {count}
        </div>
      );
    };
    const dom = render(<App />);
    await act(async () => {
      setCount(1);
      await sleep(10);
      setCount(2);
      await sleep(10);
    });
    dom.container.querySelector<HTMLDivElement>("[data-count]")?.click();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(callerCount).toBe(2);
  });
});
