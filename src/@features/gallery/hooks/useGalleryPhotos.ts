import { fetchCuratedPhotos } from "@shared/api";
import { QueryKeys } from "@shared/constants";
import { useInfiniteQuery } from "@tanstack/react-query";
import { GalleryQueryKeys } from "../constants";

type GalleryResponse = Awaited<ReturnType<typeof fetchCuratedPhotos>>;

export const useGalleryPhotos = () => {
  return useInfiniteQuery<GalleryResponse>({
    queryKey: [QueryKeys.PhotosQueryKey, GalleryQueryKeys.GalleryDataQueryKey],
    queryFn: ({ pageParam }) => fetchCuratedPhotos(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
