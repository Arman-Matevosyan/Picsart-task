import { ApiSources } from "@shared/constants";
import { IPhoto } from "@shared/types";

/**
 * Mock photo data for development
 *
 * Using mock data helps:
 * 1. Speed up development iteration
 * 2. Avoid API rate limits
 * 3. Work offline
 * 4. Test edge cases consistently
 */
export const MOCK_PHOTOS: IPhoto[] = Array.from({ length: 20 }, (_, i) => ({
  id: `mock-${i}`,
  width: 1200 + (i % 3) * 200,
  height: 800 + (i % 4) * 150,
  src: {
    original: `https://picsum.photos/id/${20 + i}/1200/800`,
    large: `https://picsum.photos/id/${20 + i}/800/600`,
    medium: `https://picsum.photos/id/${20 + i}/400/300`,
    small: `https://picsum.photos/id/${20 + i}/200/150`,
    tiny: `https://picsum.photos/id/${20 + i}/100/75`,
  },
  alt: `Sample photo ${i}`,
  photographer: `Mock Photographer ${i}`,
  photographerUrl: "https://example.com",
  avgColor: ["#A7D8FF", "#FFD8A7", "#D8FFA7", "#FFA7D8", "#A7FFD8"][i % 5],
  dateAdded: new Date(Date.now() - i * 86400000).toISOString(),
  description:
    i % 3 === 0 ? `This is a mock photo description for photo ${i}` : undefined,
  source: i % 2 === 0 ? ApiSources.Pexels : ApiSources.Unsplash,
}));

export const createMockPaginatedResponse = (page = 1, perPage = 10) => {
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const photos = MOCK_PHOTOS.slice(startIndex, endIndex);

  return {
    photos,
    page,
    per_page: perPage,
    total_results: MOCK_PHOTOS.length,
    prev_page: page > 1 ? page - 1 : null,
    next_page: endIndex < MOCK_PHOTOS.length ? page + 1 : null,
  };
};
