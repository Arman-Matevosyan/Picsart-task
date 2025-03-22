import { ApiSources } from "@shared/constants";
import { IPhoto } from "@shared/types";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  fetchCuratedPhotos,
  fetchPexelsPhotoById,
  fetchUnsplashPhotoById,
  searchPhotos,
} from "../index";
import * as pexelsApi from "../pexels";
import * as unsplashApi from "../unsplash";

vi.mock("../pexels", () => ({
  fetchCuratedPhotos: vi.fn(),
  fetchPhotoById: vi.fn(),
}));

vi.mock("../unsplash", () => ({
  searchPhotos: vi.fn(),
  fetchPhotoById: vi.fn(),
}));

describe("API index functions", () => {
  const mockPhoto: IPhoto = {
    id: "123",
    width: 1200,
    height: 800,
    src: {
      original: "https://example.com/original.jpg",
      large: "https://example.com/large.jpg",
      medium: "https://example.com/medium.jpg",
      small: "https://example.com/small.jpg",
      tiny: "https://example.com/tiny.jpg",
    },
    alt: "test",
    photographer: "test",
    source: ApiSources.Pexels,
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("fetchCuratedPhotos", () => {
    it("should call the pexels fetchCuratedPhotos", async () => {
      const mockResponse = {
        photos: [mockPhoto],
        nextPage: 2,
        totalResults: 100,
      };

      vi.mocked(pexelsApi.fetchCuratedPhotos).mockResolvedValueOnce(
        mockResponse
      );

      const result = await fetchCuratedPhotos();

      expect(pexelsApi.fetchCuratedPhotos).toHaveBeenCalled();

      expect(result).toEqual(mockResponse);
    });

    it("should pass custom parameters to the pexels fetchCuratedPhotos", async () => {
      const mockResponse = {
        photos: [mockPhoto],
        nextPage: null,
        totalResults: 100,
      };

      vi.mocked(pexelsApi.fetchCuratedPhotos).mockResolvedValueOnce(
        mockResponse
      );

      const result = await fetchCuratedPhotos(2, 10);

      expect(pexelsApi.fetchCuratedPhotos).toHaveBeenCalledWith(2, 10);

      expect(result).toEqual(mockResponse);
    });
  });

  describe("searchPhotos", () => {
    it("should call the unsplash searchPhotos", async () => {
      const mockResponse = {
        photos: [{ ...mockPhoto, source: ApiSources.Unsplash }],
        nextPage: 2,
        totalResults: 100,
      };

      vi.mocked(unsplashApi.searchPhotos).mockResolvedValueOnce(mockResponse);

      const result = await searchPhotos("nature");

      expect(unsplashApi.searchPhotos).toHaveBeenCalledWith("nature");

      expect(result).toEqual(mockResponse);
    });

    it("should pass custom parameters to the unsplash searchPhotos", async () => {
      const mockResponse = {
        photos: [{ ...mockPhoto, source: ApiSources.Unsplash }],
        nextPage: null,
        totalResults: 100,
      };

      vi.mocked(unsplashApi.searchPhotos).mockResolvedValueOnce(mockResponse);

      const result = await searchPhotos("nature", 2, 10);

      expect(unsplashApi.searchPhotos).toHaveBeenCalledWith("nature", 2, 10);

      expect(result).toEqual(mockResponse);
    });
  });

  describe("fetchPexelsPhotoById", () => {
    it("should call the pexels fetchPhotoById", async () => {
      vi.mocked(pexelsApi.fetchPhotoById).mockResolvedValueOnce(mockPhoto);

      const result = await fetchPexelsPhotoById("123");

      expect(pexelsApi.fetchPhotoById).toHaveBeenCalledWith("123");

      expect(result).toEqual(mockPhoto);
    });
  });

  describe("fetchUnsplashPhotoById", () => {
    it("should call the unsplash fetchPhotoById", async () => {
      const unsplashPhoto = { ...mockPhoto, source: ApiSources.Unsplash };
      vi.mocked(unsplashApi.fetchPhotoById).mockResolvedValueOnce(
        unsplashPhoto
      );

      const result = await fetchUnsplashPhotoById("abc123");

      expect(unsplashApi.fetchPhotoById).toHaveBeenCalledWith("abc123");

      expect(result).toEqual(unsplashPhoto);
    });
  });
});
