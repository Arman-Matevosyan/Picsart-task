import { IPhoto } from "@shared/types";
import { create } from "zustand";

interface SearchState {
  query: string;
  photos: IPhoto[];
  isLoading: boolean;
  hasNextPage: boolean;
  pageInfo: {
    currentPage: number;
    totalPages: number;
  };
  setQuery: (query: string) => void;
  setPhotos: (photos: IPhoto[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setHasNextPage: (hasNextPage: boolean) => void;
  setPageInfo: (pageInfo: { currentPage: number; totalPages: number }) => void;
  resetSearch: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: "",
  photos: [],
  isLoading: false,
  hasNextPage: false,
  pageInfo: {
    currentPage: 1,
    totalPages: 1,
  },

  setQuery: (query) => set({ query }),
  setPhotos: (photos) => set({ photos }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setHasNextPage: (hasNextPage) => set({ hasNextPage }),
  setPageInfo: (pageInfo) => set({ pageInfo }),
  resetSearch: () =>
    set({
      photos: [],
      isLoading: false,
      hasNextPage: false,
      pageInfo: {
        currentPage: 1,
        totalPages: 1,
      },
    }),
}));
