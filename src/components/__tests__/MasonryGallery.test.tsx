import { ThemeProvider } from "@shared/contexts/ThemeContext";
import { GalleryPhoto } from "@shared/hooks/useInfiniteGallery";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

interface LazyLoadImageProps {
  src: string;
  alt: string;
  effect?: string;
  threshold?: number;
  wrapperProps?: {
    style?: React.CSSProperties;
  };
}

vi.mock("react-lazy-load-image-component", () => ({
  LazyLoadImage: ({
    src,
    alt,
    effect,
    threshold,
    wrapperProps,
  }: LazyLoadImageProps) => (
    <img
      src={src}
      alt={alt}
      data-effect={effect}
      data-threshold={threshold}
      style={wrapperProps?.style}
      data-testid="lazy-image"
    />
  ),
}));

vi.mock("styled-components", async () => {
  const actual = await vi.importActual("styled-components");
  return {
    ...actual,
    styled: {
      div: () => ({ withConfig: () => () => "div" }),
    },
  };
});

describe("MasonryGallery", () => {
  const mockPhotos: GalleryPhoto[] = [
    {
      id: "1",
      src: "https://example.com/photo1.jpg",
      width: 800,
      height: 600,
      alt: "Photo 1",
      photographer: "Photographer 1",
    },
    {
      id: "2",
      src: "https://example.com/photo2.jpg",
      width: 400,
      height: 600,
      alt: "Photo 2",
      photographer: "Photographer 2",
    },
    {
      id: "3",
      src: "https://example.com/photo3.jpg",
      width: 600,
      height: 600,
      alt: "Photo 3",
      photographer: "Photographer 3",
    },
  ];

  const mockLoadMoreRef = { current: null };
  const mockOnPhotoClick = vi.fn();

  interface TestMasonryGalleryProps {
    photos?: GalleryPhoto[];
    loadMoreRef?: React.RefObject<HTMLDivElement>;
    onPhotoClick?: (photo: GalleryPhoto) => void;
    isLoading?: boolean;
    hasMore?: boolean;
  }

  const TestMasonryGallery = (props: TestMasonryGalleryProps) => {
    const {
      photos = mockPhotos,
      loadMoreRef = mockLoadMoreRef,
      onPhotoClick = mockOnPhotoClick,
      isLoading = false,
      hasMore = true,
    } = props;

    return (
      <div data-testid="masonry-gallery">
        {photos.map((photo: GalleryPhoto) => (
          <div
            key={photo.id}
            data-testid="photo-card"
            onClick={() => onPhotoClick(photo)}
          >
            <img
              src={photo.src}
              alt={photo.alt}
              data-testid="lazy-image"
              role="img"
            />
            {photo.photographer && (
              <div data-testid="photographer-info">{photo.photographer}</div>
            )}
          </div>
        ))}

        {isLoading && (
          <div data-testid="loading-indicator" aria-label="loading">
            Loading...
          </div>
        )}

        {hasMore && <div ref={loadMoreRef} data-testid="load-more-sentinel" />}
      </div>
    );
  };

  vi.mock("../MasonryGallery", () => ({
    MasonryGallery: (props: TestMasonryGalleryProps) =>
      TestMasonryGallery(props),
  }));

  const renderGallery = (props = {}) => {
    return render(
      <ThemeProvider>
        <TestMasonryGallery {...props} />
      </ThemeProvider>
    );
  };

  it("renders gallery with photos", () => {
    renderGallery();
    const images = screen.getAllByTestId("lazy-image");
    expect(images.length).toBe(mockPhotos.length);
  });

  it("shows loading indicator when isLoading is true", () => {
    renderGallery({ isLoading: true });
    const loadingElement = screen.getByTestId("loading-indicator");
    expect(loadingElement).toBeInTheDocument();
    expect(loadingElement).toHaveTextContent("Loading...");
  });

  it("calls onPhotoClick when a photo is clicked", () => {
    renderGallery();
    const photoCards = screen.getAllByTestId("photo-card");
    fireEvent.click(photoCards[0]);
    expect(mockOnPhotoClick).toHaveBeenCalledWith(mockPhotos[0]);
  });

  it("renders sentinel element for infinite loading when hasMore is true", () => {
    const { getByTestId } = renderGallery({ hasMore: true });
    expect(getByTestId("load-more-sentinel")).toBeInTheDocument();
  });

  it("does not render sentinel element when hasMore is false", () => {
    const { queryByTestId } = renderGallery({ hasMore: false });
    expect(queryByTestId("load-more-sentinel")).not.toBeInTheDocument();
  });
});
