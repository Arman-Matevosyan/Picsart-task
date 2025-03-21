import * as api from "@shared/api";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { createWrapper } from "../../../../test/test-utils";
import { useSearchPhotos } from "../useSearchPhotos";

vi.mock("@shared/api", () => ({
  searchPhotos: vi.fn(),
}));

describe("useSearchPhotos", () => {
  const mockSearchResults = {
    photos: [
      { id: "1", urls: { regular: "image1.jpg" }, alt_description: "Nature 1" },
      { id: "2", urls: { regular: "image2.jpg" }, alt_description: "Nature 2" },
    ],
    totalResults: 50,
    nextPage: 2,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (api.searchPhotos as Mock).mockResolvedValue(mockSearchResults);
  });

  it("should not fetch when no query", async () => {
    const { result } = renderHook(() => useSearchPhotos(""), {
      wrapper: createWrapper(),
    });

    expect(api.searchPhotos).not.toHaveBeenCalled();

    expect(result.current.isLoading).toBe(false);

    expect(result.current.fetchStatus).toBe("idle");
  });

  it("should fetch search results", async () => {
    const searchQuery = "nature";
    const { result } = renderHook(() => useSearchPhotos(searchQuery), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.searchPhotos).toHaveBeenCalledWith(searchQuery, 1);

    expect(result.current.data?.pages[0]).toEqual(mockSearchResults);
  });

  it("should handle fetch next page", async () => {
    const searchQuery = "nature";
    const { result } = renderHook(() => useSearchPhotos(searchQuery), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    result.current.fetchNextPage();

    await waitFor(() => expect(api.searchPhotos).toHaveBeenCalledTimes(2));

    expect(api.searchPhotos).toHaveBeenCalledWith(searchQuery, 2);
  });

  it("should handle query error", async () => {
    (api.searchPhotos as Mock).mockRejectedValue(new Error("API error"));

    const { result } = renderHook(() => useSearchPhotos("error"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });
});
