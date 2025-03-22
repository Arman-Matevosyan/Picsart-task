/**
 * Optimized fetch
 *
 * Optimizations applied:
 * - get rid of axios
 * - configurable page size for development vs production
 * - mock data support for faster development
 *
 * References:
 * - Chrome Web Dev: https://developer.chrome.com/docs/lighthouse/performance/unused-javascript#:~:text=significant%20performance%20implications,don%27t%20have%20unlimited%20data%20plans
 */

import { ApiSources } from "@shared/constants";
import { IPexelsPhoto, IPexelsPhotoResponse, IPhoto } from "@shared/types";
import { devLog } from "@shared/utils/devLog";
import { createMockPaginatedResponse, MOCK_PHOTOS } from "./mockData";

const PEXELS_API_URL = "https://api.pexels.com/v1";
const API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
const DEFAULT_PER_PAGE = import.meta.env.VITE_PEXELS_PER_PAGE
  ? parseInt(import.meta.env.VITE_PEXELS_PER_PAGE, 10)
  : 15;
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";

const commonHeaders = {
  Authorization: API_KEY,
  "Content-Type": "application/json",
};

const mapPexelsPhoto = (photo: IPexelsPhoto): IPhoto => ({
  id: photo.id.toString(),
  width: photo.width,
  height: photo.height,
  src: {
    original: photo.src.large2x || photo.src.original,
    large: photo.src.large2x || photo.src.large,
    medium: photo.src.large || photo.src.medium,
    small: photo.src.medium || photo.src.small,
    tiny: photo.src.small || photo.src.tiny,
  },
  alt: photo.alt || `Photo by ${photo.photographer}`,
  photographer: photo.photographer,
  photographerUrl: photo.photographer_url,
  avgColor: photo.avg_color,
  liked: photo.liked,
  source: ApiSources.Pexels,
});

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchCuratedPhotos = async (
  page = 1,
  perPage = DEFAULT_PER_PAGE
): Promise<{
  photos: IPhoto[];
  nextPage: number | null;
  totalResults: number;
}> => {
  if (USE_MOCK_DATA) {
    devLog.info(
      `Using mock data for curated photos (page ${page}, perPage ${perPage})`
    );
    const mockResponse = createMockPaginatedResponse(page, perPage);

    return {
      photos: mockResponse.photos,
      nextPage: mockResponse.next_page,
      totalResults: mockResponse.total_results,
    };
  }

  try {
    devLog.time(`Fetch curated photos (page ${page})`);
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    const response = await fetch(`${PEXELS_API_URL}/curated?${params}`, {
      headers: commonHeaders,
    });

    const data = await handleResponse<IPexelsPhotoResponse>(response);
    devLog.timeEnd(`Fetch curated photos (page ${page})`);

    return {
      photos: data.photos.map(mapPexelsPhoto),
      nextPage: data.next_page ? page + 1 : null,
      totalResults: data.total_results,
    };
  } catch (error) {
    devLog.error("Error fetching curated photos from Pexels:", error);
    throw error;
  }
};

export const fetchPhotoById = async (id: string): Promise<IPhoto> => {
  if (USE_MOCK_DATA) {
    devLog.info(`Using mock data for photo ID: ${id}`);
    const mockPhoto =
      MOCK_PHOTOS.find((photo) => photo.id === id) || MOCK_PHOTOS[0];
    return mockPhoto;
  }

  try {
    devLog.time(`Fetch photo by ID: ${id}`);
    const response = await fetch(`${PEXELS_API_URL}/photos/${id}`, {
      headers: commonHeaders,
    });
    const data = await handleResponse<IPexelsPhoto>(response);
    devLog.timeEnd(`Fetch photo by ID: ${id}`);
    return mapPexelsPhoto(data);
  } catch (error) {
    devLog.error(`Error fetching photo with ID ${id} from Pexels:`, error);
    throw error;
  }
};
