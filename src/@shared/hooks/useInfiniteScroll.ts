import { useCallback, useEffect, useRef } from "react";

interface UseInfiniteScrollOptions {
  containerRef: React.RefObject<HTMLElement>;
  loading: boolean;
  hasNextPage: boolean | undefined;
  onLoadMore: () => void;
  rootMargin?: string;
  threshold?: number;
  disabled?: boolean;
}

/**
 * infinite scrolling hook by observing the last child of a container.
 */
export const useInfiniteScroll = ({
  containerRef,
  loading,
  hasNextPage,
  onLoadMore,
  rootMargin = "0px 0px 400px 0px",
  threshold = 0.1,
  disabled = false,
}: UseInfiniteScrollOptions) => {
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const mutationObserverRef = useRef<MutationObserver | null>(null);
  const currentTargetRef = useRef<Element | null>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry?.isIntersecting && !loading && hasNextPage && !disabled) {
        onLoadMore();
      }
    },
    [loading, hasNextPage, disabled, onLoadMore]
  );

  useEffect(() => {
    const container = containerRef?.current;
    if (!container || disabled || loading || !hasNextPage) return;

    const cleanupObservers = () => {
      if (mutationObserverRef.current) {
        mutationObserverRef.current.disconnect();
        mutationObserverRef.current = null;
      }
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
        intersectionObserverRef.current = null;
      }
      currentTargetRef.current = null;
    };

    cleanupObservers();

    // setup MutationObserver to track child list changes
    const mutationObserver = new MutationObserver(() => {
      const lastChild = container.lastElementChild;
      if (lastChild && lastChild !== currentTargetRef.current) {
        // disconnect previous intersection observer if target change
        if (currentTargetRef.current && intersectionObserverRef.current) {
          intersectionObserverRef.current.unobserve(currentTargetRef.current);
        }
        currentTargetRef.current = lastChild;
        if (intersectionObserverRef.current) {
          intersectionObserverRef.current.observe(lastChild);
        }
      }
    });

    mutationObserver.observe(container, { childList: true });
    mutationObserverRef.current = mutationObserver;

    // setup IntersectionObserver with container as root
    const intersectionObserver = new IntersectionObserver(handleIntersect, {
      root: container,
      rootMargin,
      threshold,
    });
    intersectionObserverRef.current = intersectionObserver;

    const initialLastChild = container.lastElementChild;
    if (initialLastChild) {
      currentTargetRef.current = initialLastChild;
      intersectionObserver.observe(initialLastChild);
    }

    return () => {
      cleanupObservers();
    };
  }, [
    containerRef,
    disabled,
    loading,
    hasNextPage,
    rootMargin,
    threshold,
    handleIntersect,
  ]);
};

export default useInfiniteScroll;
