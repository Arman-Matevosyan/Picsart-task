import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { createWrapper } from "../../../test/test-utils";
import { useInfiniteGallery } from "../useInfiniteGallery";

vi.mock("../useIntersectionObserver", () => ({
  useIntersectionObserver: vi.fn().mockImplementation(() => {
    return { current: null };
  }),
}));

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useInfiniteQuery: vi.fn(),
  };
});

import { useInfiniteQuery } from "@tanstack/react-query";

describe("useInfiniteGallery", () => {
  const mockFetchPhotos = vi.fn();
  const mockQueryKey = ["test-gallery"];

  const mockPhotos = [
    { id: "1", src: "photo1.jpg", width: 800, height: 600, alt: "Photo 1" },
    { id: "2", src: "photo2.jpg", width: 400, height: 600, alt: "Photo 2" },
  ];

  const mockResponse = {
    pages: [
      {
        photos: mockPhotos,
        pageInfo: {
          hasNextPage: true,
          nextPage: 2,
          totalPages: 5,
        },
      },
    ],
    pageParams: [1],
  };

  const mockQueryResult = {
    data: mockResponse,
    fetchNextPage: vi.fn(),
    hasNextPage: true,
    isFetchingNextPage: false,
    status: "success",
    refetch: vi.fn(),
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useInfiniteQuery as Mock).mockReturnValue(mockQueryResult);
  });

  it("should initialize with correct parameters", () => {
    renderHook(
      () =>
        useInfiniteGallery({
          fetchPhotos: mockFetchPhotos,
          queryKey: mockQueryKey,
        }),
      { wrapper: createWrapper() }
    );

    expect(useInfiniteQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: mockQueryKey,
        initialPageParam: 1,
        enabled: true,
      })
    );
  });

  it("should flatten photos from multiple pages", async () => {
    const multiPageResponse = {
      pages: [
        {
          photos: mockPhotos,
          pageInfo: { hasNextPage: true, nextPage: 2, totalPages: 3 },
        },
        {
          photos: [
            {
              id: "3",
              src: "photo3.jpg",
              width: 500,
              height: 700,
              alt: "Photo 3",
            },
          ],
          pageInfo: { hasNextPage: true, nextPage: 3, totalPages: 3 },
        },
      ],
      pageParams: [1, 2],
    };

    (useInfiniteQuery as Mock).mockReturnValue({
      ...mockQueryResult,
      data: multiPageResponse,
    });

    const { result } = renderHook(
      () =>
        useInfiniteGallery({
          fetchPhotos: mockFetchPhotos,
          queryKey: mockQueryKey,
        }),
      { wrapper: createWrapper() }
    );

    // Should flatten and duplicate photos
    expect(result.current.photos.length).toBe(3);
    expect(result.current.photos[0].id).toBe("1");
    expect(result.current.photos[2].id).toBe("3");
  });

  it("should handle loading state", () => {
    (useInfiniteQuery as Mock).mockReturnValue({
      ...mockQueryResult,
      status: "pending",
      data: undefined,
    });

    const { result } = renderHook(
      () =>
        useInfiniteGallery({
          fetchPhotos: mockFetchPhotos,
          queryKey: mockQueryKey,
        }),
      { wrapper: createWrapper() }
    );

    expect(result.current.status).toBe("pending");
    expect(result.current.photos).toEqual([]);
  });

  it("should handle error state", () => {
    const testError = new Error("Test error");

    (useInfiniteQuery as Mock).mockReturnValue({
      ...mockQueryResult,
      status: "error",
      error: testError,
      data: undefined,
    });

    const { result } = renderHook(
      () =>
        useInfiniteGallery({
          fetchPhotos: mockFetchPhotos,
          queryKey: mockQueryKey,
        }),
      { wrapper: createWrapper() }
    );

    expect(result.current.status).toBe("error");
    expect(result.current.error).toBe(testError);
    expect(result.current.photos).toEqual([]);
  });

  it("should deduplicate photos with same ID", () => {
    const duplicatePhotosResponse = {
      pages: [
        {
          photos: mockPhotos,
          pageInfo: { hasNextPage: true, nextPage: 2, totalPages: 2 },
        },
        {
          photos: [
            {
              id: "1",
              src: "photo1-dup.jpg",
              width: 800,
              height: 600,
              alt: "Duplicate Photo",
            },
            {
              id: "3",
              src: "photo3.jpg",
              width: 600,
              height: 800,
              alt: "Photo 3",
            },
          ],
          pageInfo: { hasNextPage: false, nextPage: null, totalPages: 2 },
        },
      ],
      pageParams: [1, 2],
    };

    (useInfiniteQuery as Mock).mockReturnValue({
      ...mockQueryResult,
      data: duplicatePhotosResponse,
    });

    const { result } = renderHook(
      () =>
        useInfiniteGallery({
          fetchPhotos: mockFetchPhotos,
          queryKey: mockQueryKey,
        }),
      { wrapper: createWrapper() }
    );

    expect(result.current.photos.length).toBe(3);

    expect(result.current.photos[0].id).toBe("1");
    expect(result.current.photos[0].alt).toBe("Photo 1");
  });

  it("should detect empty gallery correctly", () => {
    (useInfiniteQuery as Mock).mockReturnValue({
      ...mockQueryResult,
      data: {
        pages: [
          { photos: [], pageInfo: { hasNextPage: false, nextPage: null } },
        ],
        pageParams: [1],
      },
    });

    const { result } = renderHook(
      () =>
        useInfiniteGallery({
          fetchPhotos: mockFetchPhotos,
          queryKey: mockQueryKey,
        }),
      { wrapper: createWrapper() }
    );

    expect(result.current.isEmpty).toBe(true);
    expect(result.current.photos).toEqual([]);
  });
});
