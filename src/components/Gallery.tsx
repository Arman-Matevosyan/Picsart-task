import { GalleryQueryKeys } from "@features/gallery/constants";
import {
  GalleryPhoto,
  useInfiniteGallery,
} from "@shared/hooks/useInfiniteGallery";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { MasonryGallery } from "./MasonryGallery";

interface PhotoApiParams {
  query: string;
  page: number;
  perPage: number;
}

interface PhotoApiResponse {
  photos: GalleryPhoto[];
  totalPages: number;
}

interface PexelsPhoto {
  id: number;
  src: {
    large: string;
    medium: string;
    original: string;
  };
  width: number;
  height: number;
  photographer: string;
  alt: string;
  url: string;
}

const fetchPhotosFromApi = async (
  params: PhotoApiParams
): Promise<PhotoApiResponse> => {
  const useMockData = import.meta.env.VITE_USE_MOCK_DATA === "true";

  if (
    useMockData ||
    (import.meta.env.DEV && !import.meta.env.VITE_PEXELS_API_KEY)
  ) {
    console.info("Using mock photo data");
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      photos: Array(params.perPage)
        .fill(0)
        .map((_, i) => {
          // create a unique ID by combining page, index, and a timestamp
          // this ensures IDs will be unique even if the pagination restarts
          const uniqueIndex = params.page * params.perPage + i;
          return {
            id: `photo-${uniqueIndex}-${Date.now()}`,
            src: `https://source.unsplash.com/random/800x600?sig=${uniqueIndex}`,
            width: 800,
            height: 600,
            alt: `Photo ${uniqueIndex}`,
            photographer: "Placeholder Photographer",
            url: "https://www.pexels.com/",
          };
        }),
      totalPages: 10,
    };
  }

  const apiKey = import.meta.env.VITE_PEXELS_API_KEY;

  if (!apiKey) {
    console.error(
      "Missing Pexels API key. Add VITE_PEXELS_API_KEY to your .env file"
    );
    throw new Error("API key not configured");
  }

  try {
    const endpoint = params.query ? "search" : "curated";
    const url = new URL(`https://api.pexels.com/v1/${endpoint}`);

    if (endpoint === "search") {
      url.searchParams.append("query", params.query || "nature");
    }

    url.searchParams.append("page", String(params.page));
    url.searchParams.append("per_page", String(params.perPage));

    console.log(`Fetching from Pexels ${endpoint} endpoint:`, url.toString());

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        `Pexels API error: ${response.status} ${response.statusText}`
      );
      throw new Error(
        `Pexels API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    return {
      photos: data.photos.map((photo: PexelsPhoto) => ({
        id: String(photo.id),
        src: photo.src.large,
        width: photo.width,
        height: photo.height,
        alt: photo.alt || "Photo",
        photographer: photo.photographer,
        url: photo.url,
      })),
      totalPages: Math.ceil(data.total_results / params.perPage) || 10,
    };
  } catch (error) {
    console.error("Error fetching from Pexels:", error);

    if (import.meta.env.DEV) {
      console.warn("Using fallback data in development mode due to API error");
      return {
        photos: Array(params.perPage)
          .fill(0)
          .map((_, i) => {
            const uniqueIndex = params.page * params.perPage + i;
            return {
              id: `photo-fallback-${uniqueIndex}-${Date.now()}`,
              src: `https://source.unsplash.com/random/800x600?sig=${uniqueIndex}`,
              width: 800,
              height: 600,
              alt: `Photo ${uniqueIndex}`,
              photographer: "Placeholder Photographer",
              url: "https://www.pexels.com/",
            };
          }),
        totalPages: 10,
      };
    }

    throw error;
  }
};

const GalleryContainer = styled.div`
  min-height: 100vh;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  min-height: 50vh;

  h3 {
    margin-bottom: 16px;
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  p {
    color: ${({ theme }) => theme.colors.textTertiary};
    max-width: 600px;
    margin-bottom: 24px;
  }
`;

const PhotoModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;

  img {
    max-width: 90%;
    max-height: 80vh;
    object-fit: contain;
    border-radius: 4px;
  }
`;

const ModalContent = styled.div`
  position: relative;
  max-width: 1200px;
  width: 100%;
`;

const PhotoInfo = styled.div`
  padding: 16px;
  color: white;
  text-align: center;
  margin-top: 16px;

  h3 {
    margin-bottom: 8px;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: -40px;
  right: 5%;
  background: none;
  border: none;
  color: white;
  font-size: 40px;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

interface GalleryProps {
  searchQuery?: string;
  perPage?: number;
}

export function Gallery({ searchQuery = "", perPage = 20 }: GalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  const queryKey = [
    GalleryQueryKeys.GalleryDataQueryKey,
    { search: searchQuery, perPage },
  ];

  const fetchPhotos = useCallback(
    async (page: number) => {
      const response = await fetchPhotosFromApi({
        query: searchQuery,
        page,
        perPage,
      });

      return {
        photos: response.photos,
        pageInfo: {
          hasNextPage: page < response.totalPages,
          nextPage: page + 1,
          totalPages: response.totalPages,
        },
      };
    },
    [searchQuery, perPage]
  );

  const {
    photos,
    loadMoreRef,
    hasNextPage,
    isFetchingNextPage,
    status,
    isEmpty,
    error,
  } = useInfiniteGallery({
    fetchPhotos,
    queryKey,
    initialPageSize: perPage,
    loadThreshold: "400px",
  });

  const handlePhotoClick = useCallback((photo: GalleryPhoto) => {
    setSelectedPhoto(photo);

    // prevent body scrolling when details
    document.body.style.overflow = "hidden";
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedPhoto(null);

    document.body.style.overflow = "";
  }, []);

  const handleEscKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && selectedPhoto) {
        handleCloseModal();
      }
    },
    [selectedPhoto, handleCloseModal]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleEscKey);
    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [handleEscKey]);

  if (status === "pending") {
    return (
      <GalleryContainer>
        <MasonryGallery
          photos={[]}
          loadMoreRef={loadMoreRef}
          isLoading={true}
          hasMore={false}
        />
      </GalleryContainer>
    );
  }

  if (status === "error") {
    return (
      <GalleryContainer>
        <EmptyState>
          <h3>Error loading photos</h3>
          <p>
            {error instanceof Error
              ? error.message === "API key not configured"
                ? "Missing API key. Please add your Pexels API key to the .env file or try running with mock data: npm run dev:mock"
                : error.message
              : "An unexpected error occurred. Please try again."}
          </p>
        </EmptyState>
      </GalleryContainer>
    );
  }

  if (isEmpty) {
    return (
      <GalleryContainer>
        <EmptyState>
          <h3>No photos found</h3>
          <p>
            {searchQuery
              ? `We couldn't find any photos matching "${searchQuery}". Try a different search term.`
              : "No photos available. Check back later."}
          </p>
        </EmptyState>
      </GalleryContainer>
    );
  }

  return (
    <GalleryContainer>
      <MasonryGallery
        photos={photos}
        onPhotoClick={handlePhotoClick}
        loadMoreRef={loadMoreRef}
        isLoading={isFetchingNextPage}
        hasMore={hasNextPage}
        virtualizeItems={true}
      />

      {/* Photo detail modal */}
      {selectedPhoto && (
        <PhotoModal onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
            <img
              src={selectedPhoto.src}
              alt={selectedPhoto.alt || "Photo detail"}
            />
            <PhotoInfo>
              {selectedPhoto.photographer && (
                <h3>Photo by {selectedPhoto.photographer}</h3>
              )}
              {selectedPhoto.url && (
                <a
                  href={selectedPhoto.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View original
                </a>
              )}
            </PhotoInfo>
          </ModalContent>
        </PhotoModal>
      )}
    </GalleryContainer>
  );
}
