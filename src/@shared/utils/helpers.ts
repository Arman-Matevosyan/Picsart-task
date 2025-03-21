import { IPhoto } from "@shared/types";

export const extractPhotosFromPages = (
  data: { pages: { photos: IPhoto[] }[] } | undefined
) => {
  if (!data) return [];
  return data.pages.flatMap((page) => page.photos);
};
