import { useTheme } from "@shared/index";
import { act, renderHook } from "@testing-library/react";
import { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider } from "../ThemeContext";

// mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

// mock matchMedia
const matchMediaMock = vi.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

describe("ThemeContext", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    Object.defineProperty(window, "localStorage", { value: localStorageMock });
    Object.defineProperty(window, "matchMedia", { value: matchMediaMock });

    document.documentElement.classList.add = vi.fn();
    document.documentElement.classList.remove = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should use light theme by default when no nothing set", () => {
    localStorageMock.getItem.mockReturnValueOnce(null);
    matchMediaMock.mockReturnValueOnce({ matches: false });

    const wrapper = ({ children }: { children: ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.mode).toBe("light");
    expect(result.current.isDark).toBe(false);
  });

  it("should use dark theme when dark mode is set in localStorage", () => {
    localStorageMock.getItem.mockReturnValueOnce("dark");

    const wrapper = ({ children }: { children: ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.mode).toBe("dark");
    expect(result.current.isDark).toBe(true);
    expect(document.documentElement.classList.add).toHaveBeenCalledWith(
      "dark-theme"
    );
  });

  it("should use system preference for theme when no localStorage", () => {
    localStorageMock.getItem.mockReturnValueOnce(null);
    matchMediaMock.mockReturnValueOnce({ matches: true });

    const wrapper = ({ children }: { children: ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.mode).toBe("dark");
    expect(result.current.isDark).toBe(true);
    expect(document.documentElement.classList.add).toHaveBeenCalledWith(
      "dark-theme"
    );
  });

  it("should toggle theme when toggleTheme is called", () => {
    localStorageMock.getItem.mockReturnValueOnce("light");

    const wrapper = ({ children }: { children: ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.mode).toBe("light");
    expect(result.current.isDark).toBe(false);

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.mode).toBe("dark");
    expect(result.current.isDark).toBe(true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith("theme", "dark");

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.mode).toBe("light");
    expect(result.current.isDark).toBe(false);
    expect(localStorageMock.setItem).toHaveBeenCalledWith("theme", "light");
  });

  it("should throw error when useTheme is used outside of ThemeProvider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      renderHook(() => useTheme());
    }).toThrow("useTheme must be used within a ThemeProvider");

    consoleSpy.mockRestore();
  });
});
