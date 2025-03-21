import { ApiSources } from "@shared/constants";
import { IPexelsPhoto } from "@shared/types";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as pexelsModule from "../pexels";

// mock axios
vi.mock("axios", () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
    })),
  },
}));

// mock env var
vi.mock("import.meta.env", () => ({
  VITE_PEXELS_API_KEY: "mock-pexels-api-key",
}));

const fetchCuratedPhotos = vi.spyOn(pexelsModule, "fetchCuratedPhotos");
const fetchPhotoById = vi.spyOn(pexelsModule, "fetchPhotoById");

describe("Pexels API", () => {
  const mockPexelsPhoto: IPexelsPhoto = {
    id: 123456,
    width: 1200,
    height: 800,
    url: "https://www.pexels.com/photo/123456",
    photographer: "test",
    photographer_url: "https://www.pexels.com/photographer/test",
    photographer_id: 12345,
    avg_color: "#FFFFFF",
    src: {
      original: "https://images.pexels.com/photos/123456/original.jpg",
      large2x: "https://images.pexels.com/photos/123456/large2x.jpg",
      large: "https://images.pexels.com/photos/123456/large.jpg",
      medium: "https://images.pexels.com/photos/123456/medium.jpg",
      small: "https://images.pexels.com/photos/123456/small.jpg",
      portrait: "https://images.pexels.com/photos/123456/portrait.jpg",
      landscape: "https://images.pexels.com/photos/123456/landscape.jpg",
      tiny: "https://images.pexels.com/photos/123456/tiny.jpg",
    },
    liked: false,
    alt: "A beautiful landscape",
  };

  const mappedPhoto = {
    id: mockPexelsPhoto.id.toString(),
    width: mockPexelsPhoto.width,
    height: mockPexelsPhoto.height,
    src: {
      original: mockPexelsPhoto.src.original,
      large: mockPexelsPhoto.src.large,
      medium: mockPexelsPhoto.src.medium,
      small: mockPexelsPhoto.src.small,
      tiny: mockPexelsPhoto.src.tiny,
    },
    alt: mockPexelsPhoto.alt,
    photographer: mockPexelsPhoto.photographer,
    photographerUrl: mockPexelsPhoto.photographer_url,
    avgColor: mockPexelsPhoto.avg_color,
    liked: mockPexelsPhoto.liked,
    source: ApiSources.Pexels,
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("fetchCuratedPhotos", () => {
    it("should fetch curated photos with default params", async () => {
      const mockResponse = {
        photos: [mappedPhoto],
        nextPage: 2,
        totalResults: 10000,
      };

      fetchCuratedPhotos.mockResolvedValueOnce(mockResponse);

      const result = await pexelsModule.fetchCuratedPhotos();

      expect(fetchCuratedPhotos).toHaveBeenCalled();

      expect(result).toEqual(mockResponse);
    });

    it("should fetch curated photos with custom params", async () => {
      const mockResponse = {
        photos: [mappedPhoto],
        nextPage: null,
        totalResults: 10000,
      };

      fetchCuratedPhotos.mockResolvedValueOnce(mockResponse);

      const result = await pexelsModule.fetchCuratedPhotos(2, 10);

      expect(fetchCuratedPhotos).toHaveBeenCalledWith(2, 10);

      expect(result).toEqual(mockResponse);
    });

    it("should handle and re-throw errors", async () => {
      const errorMessage = "API request failed";
      fetchCuratedPhotos.mockRejectedValueOnce(new Error(errorMessage));

      await expect(pexelsModule.fetchCuratedPhotos()).rejects.toThrow(
        errorMessage
      );
    });
  });

  describe("fetchPhotoById", () => {
    it("should fetch a photo by ID", async () => {
      fetchPhotoById.mockResolvedValueOnce(mappedPhoto);

      const result = await pexelsModule.fetchPhotoById("123456");

      expect(fetchPhotoById).toHaveBeenCalledWith("123456");

      expect(result).toEqual(mappedPhoto);
    });

    it("should handle and re-throw errors", async () => {
      const errorMessage = "Photo not found";
      fetchPhotoById.mockRejectedValueOnce(new Error(errorMessage));

      await expect(pexelsModule.fetchPhotoById("invalid-id")).rejects.toThrow(
        errorMessage
      );
    });

    it("should use photographer name as alt text if alt is not there", async () => {
      const photoWithoutAlt = {
        ...mappedPhoto,
        alt: `Photo by ${mockPexelsPhoto.photographer}`,
      };

      fetchPhotoById.mockResolvedValueOnce(photoWithoutAlt);

      const result = await pexelsModule.fetchPhotoById("123456");

      expect(result.alt).toBe(`Photo by ${mockPexelsPhoto.photographer}`);
    });
  });
});
