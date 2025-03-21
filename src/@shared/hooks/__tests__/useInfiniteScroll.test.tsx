import { render } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { useInfiniteScroll } from "../useInfiniteScroll";

const TestComponent = ({
  loading,
  hasNextPage,
  onLoadMore,
  disabled = false,
}: {
  loading: boolean;
  hasNextPage: boolean | undefined;
  onLoadMore: () => void;
  disabled?: boolean;
}) => {
  const ref = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore,
    disabled,
  });

  return <div data-testid="sentinel" ref={ref} />;
};

interface MockIntersectionObserverInterface {
  observe: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
  unobserve: ReturnType<typeof vi.fn>;
}

describe("useInfiniteScroll", () => {
  let mockIntersectionObserver: MockIntersectionObserverInterface;
  let intersectCallback: (entries: Array<{ isIntersecting: boolean }>) => void;

  beforeAll(() => {
    mockIntersectionObserver = {
      observe: vi.fn(),
      disconnect: vi.fn(),
      unobserve: vi.fn(),
    };

    global.IntersectionObserver = vi.fn().mockImplementation((callback) => {
      intersectCallback = callback;
      return mockIntersectionObserver;
    });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("should call onLoadMore when the element is not loading and has next page", () => {
    const onLoadMore = vi.fn();

    render(
      <TestComponent
        loading={false}
        hasNextPage={true}
        onLoadMore={onLoadMore}
      />
    );

    intersectCallback([{ isIntersecting: true }]);

    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it("should not call onLoadMore when loading", () => {
    const onLoadMore = vi.fn();

    render(
      <TestComponent
        loading={true}
        hasNextPage={true}
        onLoadMore={onLoadMore}
      />
    );

    intersectCallback([{ isIntersecting: true }]);

    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it("should not call onLoadMore when hasNextPage is false", () => {
    const onLoadMore = vi.fn();

    render(
      <TestComponent
        loading={false}
        hasNextPage={false}
        onLoadMore={onLoadMore}
      />
    );

    intersectCallback([{ isIntersecting: true }]);

    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it("should not call onLoadMore when disabled", () => {
    const onLoadMore = vi.fn();

    render(
      <TestComponent
        loading={false}
        hasNextPage={true}
        onLoadMore={onLoadMore}
        disabled={true}
      />
    );

    intersectCallback([{ isIntersecting: true }]);

    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it("should not call onLoadMore when not intersecting", () => {
    const onLoadMore = vi.fn();

    render(
      <TestComponent
        loading={false}
        hasNextPage={true}
        onLoadMore={onLoadMore}
      />
    );

    intersectCallback([{ isIntersecting: false }]);

    expect(onLoadMore).not.toHaveBeenCalled();
  });
});
