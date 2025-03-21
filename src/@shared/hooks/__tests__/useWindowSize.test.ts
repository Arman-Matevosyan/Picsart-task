import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useWindowSize } from "../useWindowSize";

describe("useWindowSize", () => {
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;

  const mockResize = (width: number, height: number) => {
    Object.defineProperty(window, "innerWidth", {
      value: width,
      writable: true,
    });
    Object.defineProperty(window, "innerHeight", {
      value: height,
      writable: true,
    });
    window.dispatchEvent(new Event("resize"));
  };

  afterEach(() => {
    Object.defineProperty(window, "innerWidth", {
      value: originalInnerWidth,
      writable: true,
    });
    Object.defineProperty(window, "innerHeight", {
      value: originalInnerHeight,
      writable: true,
    });
  });

  it("should return the current window dimensions on first render", () => {
    Object.defineProperty(window, "innerWidth", {
      value: 1024,
      writable: true,
    });
    Object.defineProperty(window, "innerHeight", {
      value: 768,
      writable: true,
    });

    const { result } = renderHook(() => useWindowSize());

    expect(result.current.width).toBe(1024);
    expect(result.current.height).toBe(768);
  });

  it("should update dimensions when window is resized", () => {
    const { result } = renderHook(() => useWindowSize());

    act(() => {
      mockResize(800, 600);
    });

    expect(result.current.width).toBe(800);
    expect(result.current.height).toBe(600);
  });

  it("should clean up event listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useWindowSize());
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function)
    );
  });
});
