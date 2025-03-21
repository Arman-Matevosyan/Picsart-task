import { searchPhotos } from "@shared/api";
import { QueryKeys } from "@shared/constants";
import { useInfiniteQuery } from "@tanstack/react-query";
import { SearchQueryKeys } from "../constants/enums";

type SearchResponse = Awaited<ReturnType<typeof searchPhotos>>;

export const useSearchPhotos = (query: string) => {
  return useInfiniteQuery<SearchResponse>({
    queryKey: [QueryKeys.PhotosQueryKey, SearchQueryKeys.SearchQueryKey, query],
    queryFn: ({ pageParam }) => searchPhotos(query, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!query,
  });
};
