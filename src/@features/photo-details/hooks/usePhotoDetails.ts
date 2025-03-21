import { fetchPexelsPhotoById, fetchUnsplashPhotoById } from "@shared/api";
import { ApiSources } from "@shared/constants";
import { IPhoto } from "@shared/types";
import { useQuery } from "@tanstack/react-query";
import { PhotoDetailsQueryKeys } from "../constants";

export const usePhotoDetails = (
  id: string,
  source: ApiSources.Pexels | ApiSources.Unsplash
) => {
  const fetchPhotoByIdMap = {
    [ApiSources.Pexels]: fetchPexelsPhotoById,
    [ApiSources.Unsplash]: fetchUnsplashPhotoById,
  };

  const fetchPhotoById = fetchPhotoByIdMap[source];

  return useQuery<IPhoto>({
    queryKey: [PhotoDetailsQueryKeys.PhotoDetailsQueryKey, source, id],
    queryFn: () => fetchPhotoById(id),
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
