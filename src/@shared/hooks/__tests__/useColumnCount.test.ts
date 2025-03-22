import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useColumnCount } from "../useColumnCount";
import * as useWindowSizeModule from "../useWindowSize";

interface WindowSize {
  width: number | undefined;
  height: number | undefined;
}

describe("useColumnCount", () => {
  it("should return 3 columns when width is undefined", () => {
    vi.spyOn(useWindowSizeModule, "useWindowSize").mockReturnValue({
      width: undefined,
      height: undefined,
    } as WindowSize);

    const { result } = renderHook(() => useColumnCount());
    expect(result.current).toBe(3);
  });

  it("should return 2 columns for mobile viewport (width < 640px)", () => {
    vi.spyOn(useWindowSizeModule, "useWindowSize").mockReturnValue({
      width: 500,
      height: 800,
    } as WindowSize);

    const { result } = renderHook(() => useColumnCount());
    expect(result.current).toBe(2);
  });

  it("should return 3 columns for tablet viewport (640px <= width < 1024px)", () => {
    vi.spyOn(useWindowSizeModule, "useWindowSize").mockReturnValue({
      width: 800,
      height: 1024,
    } as WindowSize);

    const { result } = renderHook(() => useColumnCount());
    expect(result.current).toBe(3);
  });

  it("should return 4 columns for desktop viewport (width >= 1024px)", () => {
    vi.spyOn(useWindowSizeModule, "useWindowSize").mockReturnValue({
      width: 1440,
      height: 900,
    } as WindowSize);

    const { result } = renderHook(() => useColumnCount());
    expect(result.current).toBe(4);
  });
});
