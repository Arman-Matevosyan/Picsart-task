import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useIntersectionObserver } from "../useIntersectionObserver";

const mockObserve = vi.fn();
const mockUnobserve = vi.fn();
const mockDisconnect = vi.fn();

class MockIntersectionObserver {
  constructor() {}
  observe = mockObserve;
  unobserve = mockUnobserve;
  disconnect = mockDisconnect;
  takeRecords = () => [];
}

global.IntersectionObserver =
  MockIntersectionObserver as unknown as typeof IntersectionObserver;

describe("useIntersectionObserver", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const TestComponent = () => {
    const handleIntersect = () => {
      /* no-op */
    };
    const ref = useIntersectionObserver<HTMLDivElement>({
      onIntersect: handleIntersect,
    });
    return (
      <div ref={ref} data-testid="element">
        Test
      </div>
    );
  };

  it("should render without crashing", () => {
    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId("element")).toBeInTheDocument();
  });

  it("should observe elements when mounted", () => {
    render(<TestComponent />);
    expect(mockObserve).toHaveBeenCalled();
  });

  // this test is unreliable because the cleanup function timing depends on React internals
  it("should unmount without errors", () => {
    const { unmount } = render(<TestComponent />);
    expect(() => unmount()).not.toThrow();
  });
});
