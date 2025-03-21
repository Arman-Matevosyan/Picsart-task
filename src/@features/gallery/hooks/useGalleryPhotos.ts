import { fetchCuratedPhotos } from "@shared/api";
import { QueryKeys } from "@shared/constants";
import { useInfiniteQuery } from "@tanstack/react-query";
import { GalleryQueryKeys } from "../constants";

type GalleryResponse = Awaited<ReturnType<typeof fetchCuratedPhotos>>;

export const useGalleryPhotos = () => {
  return useInfiniteQuery<GalleryResponse>({
    queryKey: [QueryKeys.PhotosQueryKey, GalleryQueryKeys.GalleryDataQueryKey],
    queryFn: ({ pageParam }) => fetchCuratedPhotos(pageParam as number, 12),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};
