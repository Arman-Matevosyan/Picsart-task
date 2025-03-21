import { ApiSources } from "@shared/constants";
import { IPexelsPhoto, IPexelsPhotoResponse, IPhoto } from "@shared/types";
import axios from "axios";

const PEXELS_API_URL = "https://api.pexels.com/v1";
const API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

const pexelsApi = axios.create({
  baseURL: PEXELS_API_URL,
  headers: {
    Authorization: API_KEY,
  },
});

const mapPexelsPhoto = (photo: IPexelsPhoto): IPhoto => {
  return {
    id: photo.id.toString(),
    width: photo.width,
    height: photo.height,
    src: {
      original: photo.src.original,
      large: photo.src.large,
      medium: photo.src.medium,
      small: photo.src.small,
      tiny: photo.src.tiny,
    },
    alt: photo.alt || `Photo by ${photo.photographer}`,
    photographer: photo.photographer,
    photographerUrl: photo.photographer_url,
    avgColor: photo.avg_color,
    liked: photo.liked,
    source: ApiSources.Pexels,
  };
};

export const fetchCuratedPhotos = async (
  page = 1,
  perPage = 15
): Promise<{
  photos: IPhoto[];
  nextPage: number | null;
  totalResults: number;
}> => {
  try {
    const response = await pexelsApi.get<IPexelsPhotoResponse>("/curated", {
      params: {
        page,
        per_page: perPage,
      },
    });

    return {
      photos: response.data.photos.map(mapPexelsPhoto),
      nextPage: response.data.next_page ? page + 1 : null,
      totalResults: response.data.total_results,
    };
  } catch (error) {
    console.error("Error fetching curated photos from Pexels:", error);
    throw error;
  }
};

export const fetchPhotoById = async (id: string): Promise<IPhoto> => {
  try {
    const response = await pexelsApi.get<IPexelsPhoto>(`/photos/${id}`);
    return mapPexelsPhoto(response.data);
  } catch (error) {
    console.error(`Error fetching photo with ID ${id} from Pexels:`, error);
    throw error;
  }
};
