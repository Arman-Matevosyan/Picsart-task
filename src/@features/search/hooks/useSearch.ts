import { useSearchStore } from "@shared/store";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { extractPhotosFromPages, useSearchPhotos } from "./useSearchPhotos";

export const useSearch = () => {
  const navigate = useNavigate();
  const { query, setQuery, resetSearch } = useSearchStore();

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  } = useSearchPhotos(query);

  const handleSearch = useCallback(
    (searchQuery: string) => {
      if (searchQuery !== query) {
        setQuery(searchQuery);
        resetSearch();

        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
    },
    [navigate, query, resetSearch, setQuery]
  );

  return {
    query,
    isLoading: isLoading || isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    handleSearch,
    photos: extractPhotosFromPages(data),
  };
};
