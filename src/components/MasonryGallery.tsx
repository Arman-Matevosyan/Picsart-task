import { GalleryPhoto } from "@shared/hooks/useInfiniteGallery";
import {
  memo,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import styled from "styled-components";

const COLUMNS = {
  xs: 1, // mobile
  sm: 2, // small tablets
  md: 3, // large tablets
  lg: 4, // desktop
  xl: 5, // large desktop
};

interface MasonryGalleryProps {
  photos: GalleryPhoto[];
  onPhotoClick?: (photo: GalleryPhoto) => void;
  loadMoreRef: MutableRefObject<HTMLDivElement | null>;
  isLoading?: boolean;
  hasMore?: boolean;
  virtualizeItems?: boolean;
}

const MasonryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-gap: 16px;
  padding: 16px;

  @media (min-width: 576px) {
    grid-template-columns: repeat(${COLUMNS.sm}, 1fr);
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(${COLUMNS.md}, 1fr);
  }

  @media (min-width: 992px) {
    grid-template-columns: repeat(${COLUMNS.lg}, 1fr);
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(${COLUMNS.xl}, 1fr);
  }
`;

const PhotoCard = styled.div`
  break-inside: avoid;
  margin-bottom: 16px;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }

  img {
    width: 100%;
    height: auto;
    display: block;
    transition: filter 0.3s ease;
  }

  &:hover img {
    filter: brightness(1.05);
  }
`;

const PhotoInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${PhotoCard}:hover & {
    opacity: 1;
  }
`;

const LoadingMore = styled.div`
  text-align: center;
  padding: 20px;
  grid-column: 1 / -1;
`;

const LoadingDots = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  span {
    display: inline-block;
    width: 8px;
    height: 8px;
    margin: 0 4px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    animation: pulse 1.4s infinite ease-in-out;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(0.5);
      opacity: 0.5;
    }
    50% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

// memo individual photo component to prevent unnecessary re-renders
const Photo = memo(
  ({ photo, onClick }: { photo: GalleryPhoto; onClick: () => void }) => (
    <PhotoCard onClick={onClick}>
      <LazyLoadImage
        src={photo.src}
        alt={photo.alt || "Gallery image"}
        effect="blur"
        threshold={100}
        wrapperProps={{
          style: { display: "block", width: "100%", height: "auto" },
        }}
      />
      {photo.photographer && (
        <PhotoInfo>
          <div>{photo.photographer}</div>
        </PhotoInfo>
      )}
    </PhotoCard>
  )
);

Photo.displayName = "Photo";

// memo gallery section to prevent re-rendering already loaded pages
const GallerySection = memo(
  ({
    photos,
    onPhotoClick,
  }: {
    photos: GalleryPhoto[];
    onPhotoClick: (photo: GalleryPhoto) => void;
  }) => (
    <>
      {photos.map((photo) => (
        <Photo
          key={photo.id}
          photo={photo}
          onClick={() => onPhotoClick(photo)}
        />
      ))}
    </>
  )
);

GallerySection.displayName = "GallerySection";

export function MasonryGallery({
  photos,
  onPhotoClick,
  loadMoreRef,
  isLoading,
  hasMore,
  virtualizeItems = true,
}: MasonryGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 50 });

  // handle virtualizing items for performance with large datasets
  const handleScroll = useCallback(() => {
    if (!virtualizeItems || !containerRef.current) return;

    const { scrollTop, clientHeight } =
      document.documentElement || document.body;
    const totalHeight = document.documentElement.scrollHeight;

    // load more photos into view when the user scrolls
    const scrollPercentage = (scrollTop + clientHeight) / totalHeight;
    const totalItems = photos.length;

    // show more items while user scrolls down
    // preload items above and below the viewport for smooth scrolling
    const buffer = Math.min(50, Math.floor(totalItems * 0.2));
    const viewportItems = Math.min(50, Math.floor(totalItems * 0.5));
    const newEnd = Math.min(
      totalItems,
      Math.floor(scrollPercentage * totalItems * 1.5) + viewportItems
    );
    const newStart = Math.max(0, newEnd - viewportItems - buffer);

    setVisibleRange({ start: newStart, end: newEnd });
  }, [photos.length, virtualizeItems]);

  useEffect(() => {
    if (virtualizeItems) {
      window.addEventListener("scroll", handleScroll);
      handleScroll();

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [handleScroll, virtualizeItems]);

  const handlePhotoClick = useCallback(
    (photo: GalleryPhoto) => {
      onPhotoClick?.(photo);
    },
    [onPhotoClick]
  );

  // If virtualization is enabled, only render the visible portion of photos
  const visiblePhotos = virtualizeItems
    ? photos.slice(visibleRange.start, visibleRange.end)
    : photos;

  // split photos into chunks to allow for memoized
  // this optimizes rendering when new pages are added
  const pageSize = 20;
  const photoChunks = [];

  for (let i = 0; i < visiblePhotos.length; i += pageSize) {
    photoChunks.push(visiblePhotos.slice(i, i + pageSize));
  }

  return (
    <MasonryContainer ref={containerRef}>
      {photoChunks.map((chunk, index) => (
        <GallerySection
          key={`page-${index}`}
          photos={chunk}
          onPhotoClick={handlePhotoClick}
        />
      ))}

      {isLoading && (
        <LoadingMore>
          <LoadingDots>
            <span></span>
            <span></span>
            <span></span>
          </LoadingDots>
        </LoadingMore>
      )}

      {hasMore && (
        <div
          ref={loadMoreRef}
          style={{ height: "20px", gridColumn: "1 / -1" }}
        />
      )}
    </MasonryContainer>
  );
}
