/// <reference types="../../../utils/src/global.d.ts" />
import { sleep } from "@block-kit/utils";
import type { P } from "@block-kit/utils/dist/es/types";
import { act, render } from "@testing-library/react";
import type { Dispatch, MutableRefObject, SetStateAction } from "react";
import { useState } from "react";

import { useIsMounted, useMountState } from "../../../utils/src/hooks";

describe("hooks mount", () => {
  it("is mounted", async () => {
    let setCount: Dispatch<SetStateAction<number>> | undefined = void 0;
    let mounted: MutableRefObject<boolean> | undefined = void 0;
    const App = () => {
      const [count, _setCount] = useState(0);
      const { mounted: _mounted } = useIsMounted();
      setCount = _setCount;
      mounted = _mounted;
      return <div data-count>{count}</div>;
    };
    const dom = render(<App />);
    await act(async () => {
      setCount?.(p => ++p);
      await sleep(10);
    });
    expect((mounted as P.Any)?.current).toBe(true);
    dom.unmount();
    expect((mounted as P.Any)?.current).toBe(false);
  });

  it("safe unmounted state", async () => {
    let setCount: ((next: number) => void) | undefined = void 0;
    const App = () => {
      const { mounted } = useIsMounted();
      const [count, _setCount] = useMountState(0, mounted);
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
