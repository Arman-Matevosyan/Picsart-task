/**
 * Optimized fetch
 *
 * Optimizations applied:
 * - get rid of axios
 *
 * References:
 * - Chrome Web Dev: https://developer.chrome.com/docs/lighthouse/performance/unused-javascript#:~:text=significant%20performance%20implications,don%27t%20have%20unlimited%20data%20plans
 */

import { ApiSources } from "@shared/constants";
import { IPhoto, IUnsplashPhoto, IUnsplashSearchResponse } from "@shared/types";

const UNSPLASH_API_URL = "https://api.unsplash.com";
const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

const commonHeaders = {
  Authorization: `Client-ID ${ACCESS_KEY}`,
  "Content-Type": "application/json",
};

const mapUnsplashPhoto = (photo: IUnsplashPhoto): IPhoto => ({
  id: photo.id,
  width: photo.width,
  height: photo.height,
  src: {
    original: photo.urls.raw,
    large: photo.urls.full,
    medium: photo.urls.regular,
    small: photo.urls.small,
    tiny: photo.urls.thumb,
  },
  alt: photo.alt_description || `Photo by ${photo.user.name}`,
  photographer: photo.user.name,
  photographerUrl: photo.user.links.html,
  avgColor: photo.color,
  dateAdded: photo.created_at,
  description: photo.description,
  liked: photo.liked_by_user,
  source: ApiSources.Unsplash,
});

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const searchPhotos = async (
  query: string,
  page = 1,
  perPage = 15
): Promise<{
  photos: IPhoto[];
  nextPage: number | null;
  totalResults: number;
}> => {
  try {
    const params = new URLSearchParams({
      query,
      page: page.toString(),
      per_page: perPage.toString(),
    });

    const response = await fetch(
      `${UNSPLASH_API_URL}/search/photos?${params}`,
      {
        headers: commonHeaders,
      }
    );

    const data = await handleResponse<IUnsplashSearchResponse>(response);

    return {
      photos: data.results.map(mapUnsplashPhoto),
      nextPage: page < data.total_pages ? page + 1 : null,
      totalResults: data.total,
    };
  } catch (error) {
    console.error(
      `Error searching photos with query "${query}" on Unsplash:`,
      error
    );
    throw error;
  }
};

export const fetchPhotoById = async (id: string): Promise<IPhoto> => {
  try {
    const response = await fetch(`${UNSPLASH_API_URL}/photos/${id}`, {
      headers: commonHeaders,
    });
    const data = await handleResponse<IUnsplashPhoto>(response);
    return mapUnsplashPhoto(data);
  } catch (error) {
    console.error(`Error fetching photo with ID ${id} from Unsplash:`, error);
    throw error;
  }
};
