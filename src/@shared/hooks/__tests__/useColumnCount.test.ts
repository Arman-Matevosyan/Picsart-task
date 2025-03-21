import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useColumnCount } from "../useColumnCount";
import * as useWindowSizeModule from "../useWindowSize";

describe("useColumnCount", () => {
  it("should return 3 columns when width is undefined", () => {
    vi.spyOn(useWindowSizeModule, "default").mockReturnValue({
      width: undefined,
      height: undefined,
    });

    const { result } = renderHook(() => useColumnCount());
    expect(result.current).toBe(3);
  });

  it("should return 2 columns for mobile viewport (width < 640px)", () => {
    vi.spyOn(useWindowSizeModule, "default").mockReturnValue({
      width: 500,
      height: 800,
    });

    const { result } = renderHook(() => useColumnCount());
    expect(result.current).toBe(2);
  });

  it("should return 3 columns for tablet viewport (640px <= width < 1024px)", () => {
    vi.spyOn(useWindowSizeModule, "default").mockReturnValue({
      width: 800,
      height: 1024,
    });

    const { result } = renderHook(() => useColumnCount());
    expect(result.current).toBe(3);
  });

  it("should return 4 columns for desktop viewport (width >= 1024px)", () => {
    vi.spyOn(useWindowSizeModule, "default").mockReturnValue({
      width: 1440,
      height: 900,
    });

    const { result } = renderHook(() => useColumnCount());
    expect(result.current).toBe(4);
  });
});
