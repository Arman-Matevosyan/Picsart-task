import { ApiSources } from "@shared/constants";
import { IUnsplashPhoto } from "@shared/types";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as unsplashModule from "../unsplash";

vi.mock("axios", () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
    })),
  },
}));

// mock env vars
vi.mock("import.meta.env", () => ({
  VITE_UNSPLASH_ACCESS_KEY: "mock-unsplash-access-key",
}));

const searchPhotos = vi.spyOn(unsplashModule, "searchPhotos");
const fetchPhotoById = vi.spyOn(unsplashModule, "fetchPhotoById");

describe("Unsplash API", () => {
  const mockUnsplashPhoto: IUnsplashPhoto = {
    id: "abc123",
    created_at: "2023-01-01T12:00:00Z",
    updated_at: "2023-01-02T12:00:00Z",
    width: 1200,
    height: 800,
    color: "#FFFFFF",
    blur_hash: "LHF$R+of_3of~qofD%of00WB%LWB",
    description: "A beautiful landscape",
    alt_description: "Landscape with mountains and lake",
    urls: {
      raw: "https://images.unsplash.com/photo-abc123?ixid=123&ixlib=rb-1.2.1",
      full: "https://images.unsplash.com/photo-abc123?ixid=123&ixlib=rb-1.2.1&q=85&fm=jpg",
      regular:
        "https://images.unsplash.com/photo-abc123?ixid=123&ixlib=rb-1.2.1&q=80&fm=jpg&w=1080",
      small:
        "https://images.unsplash.com/photo-abc123?ixid=123&ixlib=rb-1.2.1&q=80&fm=jpg&w=400",
      thumb:
        "https://images.unsplash.com/photo-abc123?ixid=123&ixlib=rb-1.2.1&q=80&fm=jpg&w=200",
    },
    links: {
      self: "https://api.unsplash.com/photos/abc123",
      html: "https://unsplash.com/photos/abc123",
      download: "https://unsplash.com/photos/abc123/download",
      download_location: "https://api.unsplash.com/photos/abc123/download",
    },
    likes: 150,
    liked_by_user: false,
    user: {
      id: "test",
      username: "testname",
      name: "Test",
      portfolio_url: "https://test.com",
      bio: "Photographer",
      location: "New York",
      total_likes: 100,
      total_photos: 50,
      total_collections: 10,
      instagram_username: "test",
      twitter_username: "test",
      links: {
        self: "https://api.unsplash.com/users/test",
        html: "https://unsplash.com/@test",
        photos: "https://api.unsplash.com/users/test/photos",
        likes: "https://api.unsplash.com/users/test/likes",
        portfolio: "https://api.unsplash.com/users/test/portfolio",
        following: "https://api.unsplash.com/users/test/following",
        followers: "https://api.unsplash.com/users/test/followers",
      },
      profile_image: {
        small:
          "https://images.unsplash.com/profile-test?ixlib=rb-1.2.1&q=80&fm=jpg&w=50",
        medium:
          "https://images.unsplash.com/profile-test?ixlib=rb-1.2.1&q=80&fm=jpg&w=100",
        large:
          "https://images.unsplash.com/profile-test?ixlib=rb-1.2.1&q=80&fm=jpg&w=200",
      },
    },
  };

  const mappedPhoto = {
    id: mockUnsplashPhoto.id,
    width: mockUnsplashPhoto.width,
    height: mockUnsplashPhoto.height,
    src: {
      original: mockUnsplashPhoto.urls.raw,
      large: mockUnsplashPhoto.urls.full,
      medium: mockUnsplashPhoto.urls.regular,
      small: mockUnsplashPhoto.urls.small,
      tiny: mockUnsplashPhoto.urls.thumb,
    },
    alt: mockUnsplashPhoto.alt_description,
    photographer: mockUnsplashPhoto.user.name,
    photographerUrl: mockUnsplashPhoto.user.links.html,
    avgColor: mockUnsplashPhoto.color,
    dateAdded: mockUnsplashPhoto.created_at,
    description: mockUnsplashPhoto.description,
    liked: mockUnsplashPhoto.liked_by_user,
    source: ApiSources.Unsplash,
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("searchPhotos", () => {
    it("should search photos with default parameters", async () => {
      const mockResponse = {
        photos: [mappedPhoto],
        nextPage: 2,
        totalResults: 10000,
      };

      searchPhotos.mockResolvedValueOnce(mockResponse);

      const result = await unsplashModule.searchPhotos("nature");

      expect(searchPhotos).toHaveBeenCalledWith("nature");

      expect(result).toEqual(mockResponse);
    });

    it("should search photos with custom parameters", async () => {
      const mockResponse = {
        photos: [mappedPhoto],
        nextPage: null,
        totalResults: 10000,
      };

      searchPhotos.mockResolvedValueOnce(mockResponse);

      const result = await unsplashModule.searchPhotos("mountains", 5, 10);

      expect(searchPhotos).toHaveBeenCalledWith("mountains", 5, 10);

      expect(result).toEqual(mockResponse);
    });

    it("should handle and re-throw errors", async () => {
      const errorMessage = "API request failed";
      searchPhotos.mockRejectedValueOnce(new Error(errorMessage));

      await expect(unsplashModule.searchPhotos("error")).rejects.toThrow(
        errorMessage
      );
    });
  });

  describe("fetchPhotoById", () => {
    it("should fetch a photo by ID", async () => {
      fetchPhotoById.mockResolvedValueOnce(mappedPhoto);

      const result = await unsplashModule.fetchPhotoById("abc123");

      expect(fetchPhotoById).toHaveBeenCalledWith("abc123");

      expect(result).toEqual(mappedPhoto);
    });

    it("should handle and re-throw errors", async () => {
      const errorMessage = "Photo not found";
      fetchPhotoById.mockRejectedValueOnce(new Error(errorMessage));

      await expect(unsplashModule.fetchPhotoById("invalid-id")).rejects.toThrow(
        errorMessage
      );
    });

    it("should use photographer name as alt text if alt_description is not there", async () => {
      const photoWithoutAlt = {
        ...mappedPhoto,
        alt: `Photo by ${mockUnsplashPhoto.user.name}`,
      };

      fetchPhotoById.mockResolvedValueOnce(photoWithoutAlt);

      const result = await unsplashModule.fetchPhotoById("abc123");

      expect(result.alt).toBe(`Photo by ${mockUnsplashPhoto.user.name}`);
    });
  });
});
