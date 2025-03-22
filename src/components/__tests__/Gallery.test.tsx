import { GalleryQueryKeys } from "@features/gallery/constants";
import { ThemeProvider } from "@shared/contexts/ThemeContext";
import * as useInfiniteGalleryModule from "@shared/hooks/useInfiniteGallery";
import { GalleryPhoto } from "@shared/hooks/useInfiniteGallery";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Gallery } from "../Gallery";

interface MasonryGalleryProps {
  photos: GalleryPhoto[];
  onPhotoClick: (photo: GalleryPhoto) => void;
  loadMoreRef: React.RefObject<HTMLDivElement>;
  isLoading: boolean;
  hasMore: boolean;
}

vi.mock("../MasonryGallery", () => ({
  MasonryGallery: ({
    photos,
    onPhotoClick,
    loadMoreRef,
    isLoading,
    hasMore,
  }: MasonryGalleryProps) => (
    <div data-testid="masonry-gallery">
      {photos.map((photo) => (
        <div
          key={photo.id}
          data-testid="photo-item"
          onClick={() => onPhotoClick(photo)}
        >
          <img src={photo.src} alt={photo.alt} />
          {photo.photographer && (
            <div data-testid="photographer">{photo.photographer}</div>
          )}
        </div>
      ))}
      <div
        data-testid="loading-indicator"
        style={{ display: isLoading ? "block" : "none" }}
      >
        Loading...
      </div>
      <div
        ref={loadMoreRef}
        data-testid="load-more"
        style={{ display: hasMore ? "block" : "none" }}
      ></div>
    </div>
  ),
}));

vi.mock("styled-components", async () => {
  const actual = await vi.importActual("styled-components");
  return {
    ...actual,
    default: {
      div: () => "div",
      button: () => "button",
    },
  };
});

describe("Gallery", () => {
  const mockPhotos = [
    {
      id: "1",
      src: "https://example.com/photo1.jpg",
      width: 800,
      height: 600,
      alt: "Photo 1",
      photographer: "Photographer 1",
      url: "https://example.com/photo1",
    },
    {
      id: "2",
      src: "https://example.com/photo2.jpg",
      width: 400,
      height: 600,
      alt: "Photo 2",
      photographer: "Photographer 2",
      url: "https://example.com/photo2",
    },
  ];

  const mockLoadMoreRef = { current: null };

  const mockUseInfiniteGallery = vi.fn().mockReturnValue({
    photos: mockPhotos,
    loadMoreRef: mockLoadMoreRef,
    hasNextPage: true,
    isFetchingNextPage: false,
    status: "success",
    isEmpty: false,
    error: null,
  });

  beforeEach(() => {
    vi.spyOn(useInfiniteGalleryModule, "useInfiniteGallery").mockImplementation(
      mockUseInfiniteGallery
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders gallery with photos", () => {
    render(
      <ThemeProvider>
        <Gallery />
      </ThemeProvider>
    );

    expect(screen.getByTestId("masonry-gallery")).toBeInTheDocument();
    expect(screen.getAllByTestId("photo-item").length).toBe(mockPhotos.length);
  });

  it("shows loading state while photos are being fetched", () => {
    mockUseInfiniteGallery.mockReturnValueOnce({
      status: "pending",
      loadMoreRef: mockLoadMoreRef,
    });

    render(
      <ThemeProvider>
        <Gallery />
      </ThemeProvider>
    );

    expect(screen.getByTestId("masonry-gallery")).toBeInTheDocument();
    expect(screen.queryAllByTestId("photo-item").length).toBe(0);
  });

  it("shows error message when API fails", () => {
    mockUseInfiniteGallery.mockReturnValueOnce({
      status: "error",
      error: new Error("API Error"),
      loadMoreRef: mockLoadMoreRef,
    });

    render(
      <ThemeProvider>
        <Gallery />
      </ThemeProvider>
    );

    expect(screen.getByText(/Error loading photos/i)).toBeInTheDocument();
    expect(screen.getByText(/API Error/i)).toBeInTheDocument();
  });

  it("shows empty state when no photos are found", () => {
    mockUseInfiniteGallery.mockReturnValueOnce({
      status: "success",
      isEmpty: true,
      photos: [],
      loadMoreRef: mockLoadMoreRef,
    });

    render(
      <ThemeProvider>
        <Gallery />
      </ThemeProvider>
    );

    expect(screen.getByText(/No photos found/i)).toBeInTheDocument();
  });

  it("opens modal when a photo is clicked", () => {
    render(
      <ThemeProvider>
        <Gallery />
      </ThemeProvider>
    );

    fireEvent.click(screen.getAllByTestId("photo-item")[0]);

    expect(screen.getByText(/Photo by Photographer 1/i)).toBeInTheDocument();
    expect(screen.getByText(/View original/i)).toBeInTheDocument();
  });

  it("closes modal when close button is clicked", () => {
    render(
      <ThemeProvider>
        <Gallery />
      </ThemeProvider>
    );

    fireEvent.click(screen.getAllByTestId("photo-item")[0]);
    expect(screen.getByText(/Photo by Photographer 1/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button"));

    expect(
      screen.queryByText(/Photo by Photographer 1/i)
    ).not.toBeInTheDocument();
  });

  it("passes search query to useInfiniteGallery", () => {
    const searchQuery = "nature";
    render(
      <ThemeProvider>
        <Gallery searchQuery={searchQuery} />
      </ThemeProvider>
    );

    expect(mockUseInfiniteGallery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [
          GalleryQueryKeys.GalleryDataQueryKey,
          { search: searchQuery, perPage: 20 },
        ],
      })
    );
  });
});
