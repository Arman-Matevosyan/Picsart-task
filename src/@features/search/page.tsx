import { MasonryGridSkeleton } from "@shared/components";
import { ImageCard } from "@shared/components/ImageCard";
import { MasonryGrid } from "@shared/components/MasonryGrid";
import { PageHeader } from "@shared/components/PageHeader";
import { useInfiniteScroll } from "@shared/hooks";
import { IPhoto } from "@shared/types";
import { extractPhotosFromPages } from "@shared/utils";
import { FC, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { useSearchPhotos } from "./hooks/useSearchPhotos";

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

export const SearchResultsPage: FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  } = useSearchPhotos(query);

  const photos = extractPhotosFromPages(data);
  const renderPhoto = useCallback(
    (photo: IPhoto) => <ImageCard key={photo.id} photo={photo} />,
    []
  );
  const loadMoreRef = useInfiniteScroll({
    loading: isLoading || isFetchingNextPage,
    hasNextPage,
    onLoadMore: fetchNextPage,
  });

  return (
    <Container>
      <PageHeader
        title={`Search Results: ${query}`}
        showSearch
        initialValue={query}
      />

      {error && (
        <div className="error-message">
          Error loading search results. Please try again later.
        </div>
      )}

      {isLoading ? (
        <MasonryGridSkeleton />
      ) : (
        <>
          {photos.length === 0 && !error && (
            <div className="no-results">
              <h2>No results found</h2>
              <p>Try a different search term or browse our gallery.</p>
            </div>
          )}

          {photos.length > 0 && (
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
          )}
        </>
      )}
    </Container>
  );
};
