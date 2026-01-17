/// <reference types="../../../utils/src/global.d.ts" />
import { sleep } from "@block-kit/utils";
import { act, render } from "@testing-library/react";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useLayoutEffect, useState } from "react";

import { useIsMounted, useMountState, useSafeState, useStateRef } from "../../../utils/src/hooks";

describe("hooks state", () => {
  it("set state persist", async () => {
    const spy = jest.fn();
    let setCount: Dispatch<SetStateAction<number>> | undefined = void 0;
    const App = () => {
      const [count, _setCount] = useState(0);
      const [, _1] = useSafeState(0);
      const { mounted } = useIsMounted();
      const [, _2] = useMountState(0, mounted);
      const [, _3] = useStateRef(0);
      setCount = _setCount;
      useEffect(() => {
        spy();
      }, [_1, _2, _3]);
      return <div data-count>{count}</div>;
    };
    render(<App />);
    await act(async () => {
      setCount?.(p => ++p);
      await sleep(10);
      setCount?.(p => ++p);
      await sleep(10);
      setCount?.(p => ++p);
      await sleep(10);
    });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("safe render set state", async () => {
    const App = () => {
      const [count, setCount] = useSafeState(0);
      useLayoutEffect(() => setCount(1), [setCount]);
      return <div data-count>{count}</div>;
    };
    const dom = render(<App />);
    await sleep(10);
    expect(dom.container.querySelector("[data-count]")?.innerHTML).toBe("1");
  });

  it("safe unmounted state", async () => {
    let setCount: ((next: number) => void) | undefined = void 0;
    const App = () => {
      const [count, _setCount] = useSafeState(0);
      setCount = _setCount;
      return <div>{count}</div>;
    };
    const dom = render(<App />);
    const spy = jest.fn();
    act(() => {
      dom.unmount();
      const error = console.error;
      console.error = spy;
      setCount && setCount(10);
      console.error = error;
    });
    expect(spy).toHaveBeenCalledTimes(0);
  });
});
