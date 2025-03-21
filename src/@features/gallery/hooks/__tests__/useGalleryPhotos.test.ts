import * as api from "@shared/api";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { createWrapper } from "../../../../test/test-utils";
import { useGalleryPhotos } from "../useGalleryPhotos";

// mock the  API
vi.mock("@shared/api", () => ({
  fetchCuratedPhotos: vi.fn(),
}));

describe("useGalleryPhotos", () => {
  const mockPhotos = {
    photos: [
      { id: "1", urls: { regular: "image1.jpg" }, alt_description: "Test 1" },
      { id: "2", urls: { regular: "image2.jpg" }, alt_description: "Test 2" },
    ],
    totalResults: 100,
    nextPage: 2,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (api.fetchCuratedPhotos as Mock).mockResolvedValue(mockPhotos);
  });

  it("should fetch gallery photos", async () => {
    const { result } = renderHook(() => useGalleryPhotos(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.fetchCuratedPhotos).toHaveBeenCalledWith(1, 12);

    expect(result.current.data?.pages[0]).toEqual(mockPhotos);
  });

  it("should fetch next page", async () => {
    const { result } = renderHook(() => useGalleryPhotos(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    result.current.fetchNextPage();

    await waitFor(() =>
      expect(api.fetchCuratedPhotos).toHaveBeenCalledTimes(2)
    );

    expect(api.fetchCuratedPhotos).toHaveBeenCalledWith(2, 12);
  });

  it("should handle query error", async () => {
    (api.fetchCuratedPhotos as Mock).mockRejectedValue(new Error("API error"));

    const { result } = renderHook(() => useGalleryPhotos(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });
});
