import {
  ImageCard,
  MasonryGrid,
  MasonryGridSkeleton,
  PageHeader,
} from "@shared/components";
import { useInfiniteScroll } from "@shared/hooks";
import { IPhoto } from "@shared/types";
import { extractPhotosFromPages } from "@shared/utils";
import { PerformanceProfiler } from "@shared/utils/Profiler";
import { FC, useCallback, useMemo } from "react";
import styled from "styled-components";
import { useGalleryPhotos } from "./hooks";

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 16px;
  min-height: 100%;
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.textPrimary};
  transition: background-color 0.3s ease, color 0.3s ease;

  @media (max-width: 768px) {
    padding: 0 8px;
  }
`;

export const GalleryPage: FC = () => {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  } = useGalleryPhotos();

  // extract and memoize photos no unnecessary re-renders
  const photos = useMemo(() => extractPhotosFromPages(data), [data]);

  // memoize the renderPhoto no unnecessary re-renders
  const renderPhoto = useCallback(
    (photo: IPhoto, index: number) => (
      <ImageCard
        key={photo.id}
        photo={photo}
        index={index}
        // mark first few photos as high priority
        isPriority={index < 2}
      />
    ),
    []
  );

  const loadMoreRef = useInfiniteScroll({
    loading: isLoading || isFetchingNextPage,
    hasNextPage,
    onLoadMore: fetchNextPage,
  });

  return (
    <Container>
      <PageHeader title="Picsart Gallery" showSearch />

      {error && (
        <div className="error-message">
          Error loading photos. Please try again later.
        </div>
      )}

      {isLoading ? (
        <MasonryGridSkeleton />
      ) : (
        <PerformanceProfiler id="GalleryMasonryGrid">
          <MasonryGrid
            items={photos}
            renderItem={renderPhoto}
            loadingElement={
              isFetchingNextPage && (
                <div className="loading">Loading more images...</div>
              )
            }
            sentinelElement={<div ref={loadMoreRef} />}
          />
        </PerformanceProfiler>
      )}
    </Container>
  );
};
