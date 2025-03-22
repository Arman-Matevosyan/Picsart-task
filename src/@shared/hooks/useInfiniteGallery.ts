import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useIntersectionObserver } from "./useIntersectionObserver";

export interface GalleryPhoto {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  photographer?: string;
  url?: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  nextPage: number | null;
  totalPages?: number;
}

export interface GalleryResponse {
  photos: GalleryPhoto[];
  pageInfo: PageInfo;
}

export interface InfiniteGalleryOptions {
  /**
   * The fetch function that loads each page of photos
   * Should return a GalleryResponse with photos and pagination info
   */
  fetchPhotos: (page: number) => Promise<GalleryResponse>;

  /**
   * React Query query key for this infinite query
   */
  queryKey: QueryKey;

  /**
   * Number of initial photos to load
   * @default 20
   */
  initialPageSize?: number;

  /**
   * Whether to enable the query - useful for when dependencies aren't ready
   * @default true
   */
  enabled?: boolean;

  /**
   * Custom stale time in milliseconds - how long before data is considered stale
   * @default 5 minutes (from global QueryClient config)
   */
  staleTime?: number;

  /**
   * Load threshold - how far from the bottom to start loading the next page
   * Higher values preload sooner (e.g., '400px' loads next page when 400px from bottom)
   * @default '200px'
   */
  loadThreshold?: string;

  /**
   * Whether to refetch on window focus
   * @default false
   */
  refetchOnWindowFocus?: boolean;
}

// Return type for the useInfiniteGallery hook
export interface InfiniteGalleryResult {
  /**
   * Flattened array of photos from all pages
   */
  photos: GalleryPhoto[];

  /**
   * Ref to attach to the load more sentinel element
   */
  loadMoreRef: MutableRefObject<HTMLDivElement | null>;

  /**
   * Whether there are more pages to load
   */
  hasNextPage: boolean | undefined;

  /**
   * Whether the next page is currently being fetched
   */
  isFetchingNextPage: boolean;

  /**
   * Status of the query: 'pending', 'error', 'success'
   */
  status: "pending" | "error" | "success";

  /**
   * Error object if the query failed
   */
  error: unknown;

  /**
   * Whether the gallery is empty (successful query but no photos)
   */
  isEmpty: boolean;

  /**
   * Raw data from React Query for advanced use cases
   */
  rawData: InfiniteData<GalleryResponse> | undefined;

  /**
   * Timestamp of when the data was last updated
   */
  lastUpdatedAt: number;
}

/**
 * Hook for implementing infinite-scroll galleries with efficient pagination,
 * optimized rendering, and bfcache compatibility.
 */
export function useInfiniteGallery({
  fetchPhotos,
  queryKey,
  enabled = true,
  staleTime,
  loadThreshold = "200px",
  refetchOnWindowFocus = false,
}: InfiniteGalleryOptions): InfiniteGalleryResult {
  const hasNextPageRef = useRef(true);
  const isFetchingNextPageRef = useRef(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number>(Date.now());

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
    error,
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      return await fetchPhotos(pageParam as number);
    },
    getNextPageParam: (lastPage) => {
      hasNextPageRef.current = lastPage.pageInfo.hasNextPage;

      return lastPage.pageInfo.hasNextPage ? lastPage.pageInfo.nextPage : null;
    },
    initialPageParam: 1,
    enabled,
    staleTime,
    refetchOnWindowFocus,
    gcTime: 24 * 60 * 60 * 1000,
  });

  useEffect(() => {
    if (data) {
      setLastUpdatedAt(Date.now());
    }
  }, [data]);

  useEffect(() => {
    isFetchingNextPageRef.current = isFetchingNextPage;
  }, [isFetchingNextPage]);

  const handleLoadMore = useCallback(() => {
    if (!isFetchingNextPageRef.current && hasNextPageRef.current) {
      fetchNextPage();
    }
  }, [fetchNextPage]);

  const loadMoreRef = useIntersectionObserver<HTMLDivElement>({
    rootMargin: loadThreshold,
    onIntersect: handleLoadMore,
    enabled:
      status === "success" && hasNextPage === true && !isFetchingNextPage,
  });

  // Use a memo to avoid recalculating on every render
  const flattenedPhotos = useMemo(() => {
    if (!data?.pages) return [];

    const uniquePhotoIds = new Set<string>();
    const uniquePhotos: GalleryPhoto[] = [];

    data.pages.forEach((page) => {
      page.photos.forEach((photo) => {
        if (!uniquePhotoIds.has(photo.id)) {
          uniquePhotoIds.add(photo.id);
          uniquePhotos.push(photo);
        }
      });
    });

    return uniquePhotos;
  }, [data?.pages]);

  // Handle bfcache restoration - refetch if data is stale
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // page was restored from bfcache
        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000;

        if (now - lastUpdatedAt > fiveMinutes) {
          console.info(
            "Refreshing infinite gallery data after bfcache restoration"
          );
          refetch();
        }
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [refetch, lastUpdatedAt]);

  const typedData = data as InfiniteData<GalleryResponse> | undefined;

  return {
    photos: flattenedPhotos,
    loadMoreRef,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
    isEmpty: flattenedPhotos.length === 0 && status === "success",
    rawData: typedData,
    lastUpdatedAt,
  };
}
