import { act, render, screen } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { useElementSize } from "../useElementSize";

const TestComponent = () => {
  const [ref, size] = useElementSize<HTMLDivElement>();

  return (
    <div data-testid="container">
      <div
        data-testid="test-element"
        ref={ref}
        style={{ width: "100px", height: "50px" }}
      >
        Test Element
      </div>
      <div data-testid="width">{size.width}</div>
      <div data-testid="height">{size.height}</div>
    </div>
  );
};

describe("useElementSize", () => {
  const mockResizeObserver = vi.fn();

  beforeAll(() => {
    global.ResizeObserver = vi.fn().mockImplementation((callback) => {
      mockResizeObserver.mockImplementation((entries) => callback(entries));

      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };
    });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("should initialize with zero dimensions", () => {
    render(<TestComponent />);

    expect(screen.getByTestId("width").textContent).toBe("0");
    expect(screen.getByTestId("height").textContent).toBe("0");
  });

  it("should update size when ResizeObserver throws borderBoxSize", async () => {
    render(<TestComponent />);

    const entry = {
      borderBoxSize: [{ inlineSize: 100, blockSize: 50 }],
      contentRect: { width: 0, height: 0 },
    };

    await act(async () => {
      mockResizeObserver([entry]);
    });

    expect(screen.getByTestId("width").textContent).toBe("100");
    expect(screen.getByTestId("height").textContent).toBe("50");
  });

  it("should update size when ResizeObserver throws contentRect", async () => {
    render(<TestComponent />);

    const entry = {
      borderBoxSize: undefined,
      contentRect: { width: 120, height: 60 },
    };

    await act(async () => {
      mockResizeObserver([entry]);
    });

    expect(screen.getByTestId("width").textContent).toBe("120");
    expect(screen.getByTestId("height").textContent).toBe("60");
  });
});
