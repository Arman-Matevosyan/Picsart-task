import * as api from "@shared/api";
import { ApiSources } from "@shared/constants";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { createWrapper } from "../../../../test/test-utils";
import { usePhotoDetails } from "../usePhotoDetails";

// mock the API
vi.mock("@shared/api", () => ({
  fetchUnsplashPhotoById: vi.fn(),
  fetchPexelsPhotoById: vi.fn(),
}));

describe("usePhotoDetails", () => {
  const mockPhotoDetails = {
    id: "photo123",
    src: "https://example.com/photo.jpg",
    alt: "Test Photo",
    photographer: "John Doe",
    photographerUrl: "https://example.com/johndoe",
    width: 1200,
    height: 800,
    liked: false,
    color: "#000000",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (api.fetchUnsplashPhotoById as Mock).mockResolvedValue(mockPhotoDetails);
    (api.fetchPexelsPhotoById as Mock).mockResolvedValue(mockPhotoDetails);
  });

  it("should fetch Unsplash photo details", async () => {
    const photoId = "photo123";
    const { result } = renderHook(
      () => usePhotoDetails(photoId, ApiSources.Unsplash),
      { wrapper: createWrapper() }
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.fetchUnsplashPhotoById).toHaveBeenCalledWith(photoId);
    expect(api.fetchPexelsPhotoById).not.toHaveBeenCalled();

    expect(result.current.data).toEqual(mockPhotoDetails);
  });

  it("should fetch Pexels photo details", async () => {
    const photoId = "photo123";
    const { result } = renderHook(
      () => usePhotoDetails(photoId, ApiSources.Pexels),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.fetchPexelsPhotoById).toHaveBeenCalledWith(photoId);
    expect(api.fetchUnsplashPhotoById).not.toHaveBeenCalled();

    expect(result.current.data).toEqual(mockPhotoDetails);
  });

  it("should handle query error", async () => {
    (api.fetchUnsplashPhotoById as Mock).mockRejectedValue(
      new Error("API error")
    );

    const { result } = renderHook(
      () => usePhotoDetails("photo123", ApiSources.Unsplash),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });
});
