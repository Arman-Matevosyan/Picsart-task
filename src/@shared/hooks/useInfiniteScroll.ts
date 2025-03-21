import { useCallback, useEffect, useRef } from "react";

interface UseInfiniteScrollOptions {
  loading: boolean;
  hasNextPage: boolean | undefined;
  onLoadMore: () => void;
  rootMargin?: string;
  threshold?: number;
  disabled?: boolean;
}

export const useInfiniteScroll = ({
  loading,
  hasNextPage,
  onLoadMore,
  rootMargin = "0px 0px 400px 0px", // load more when item is 400px from viewport bottom
  threshold = 0.1,
  disabled = false,
}: UseInfiniteScrollOptions) => {
  const observerRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      // if entry is intersecting, not currently loading, has more pages, and not disabled
      if (entry?.isIntersecting && !loading && hasNextPage && !disabled) {
        // trigger the load more callback
        onLoadMore();
      }
    },
    [loading, hasNextPage, onLoadMore, disabled]
  );

  useEffect(() => {
    if (loading || !hasNextPage || disabled) return;

    const element = observerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin,
      threshold,
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [handleObserver, loading, hasNextPage, rootMargin, threshold, disabled]);

  return observerRef;
};

export default useInfiniteScroll;
