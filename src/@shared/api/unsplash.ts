import { ApiSources } from "@shared/constants";
import { IPhoto, IUnsplashPhoto, IUnsplashSearchResponse } from "@shared/types";
import axios from "axios";

const UNSPLASH_API_URL = "https://api.unsplash.com";
const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

const unsplashApi = axios.create({
  baseURL: UNSPLASH_API_URL,
  headers: {
    Authorization: `Client-ID ${ACCESS_KEY}`,
  },
});

const mapUnsplashPhoto = (photo: IUnsplashPhoto): IPhoto => {
  return {
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
  };
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
    const response = await unsplashApi.get<IUnsplashSearchResponse>(
      "/search/photos",
      {
        params: {
          query,
          page,
          per_page: perPage,
        },
      }
    );

    return {
      photos: response.data.results.map(mapUnsplashPhoto),
      nextPage: page < response.data.total_pages ? page + 1 : null,
      totalResults: response.data.total,
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
    const response = await unsplashApi.get<IUnsplashPhoto>(`/photos/${id}`);
    return mapUnsplashPhoto(response.data);
  } catch (error) {
    console.error(`Error fetching photo with ID ${id} from Unsplash:`, error);
    throw error;
  }
};
