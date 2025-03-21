import { describe, expect, it } from "vitest";
import { IPhoto } from "../../types";
import { extractPhotosFromPages } from "../helpers";

describe("extractPhotosFromPages", () => {
  it("should return an empty array when data is undefined", () => {
    const result = extractPhotosFromPages(undefined);
    expect(result).toEqual([]);
  });

  it("should return an empty array when data has no pages", () => {
    const result = extractPhotosFromPages({ pages: [] });
    expect(result).toEqual([]);
  });

  it("should extract photos from a single page", () => {
    const mockPhotos: IPhoto[] = [
      {
        id: "1",
        width: 800,
        height: 600,
        src: {
          original: "https://example.com/photo1/original",
          large: "https://example.com/photo1/large",
          medium: "https://example.com/photo1/medium",
          small: "https://example.com/photo1/small",
          tiny: "https://example.com/photo1/tiny",
        },
        alt: "Photo 1",
        photographer: "Photographer 1",
        photographerUrl: "https://example.com/photographer1",
        avgColor: "#eeeeee",
        source: "pexels",
      },
      {
        id: "2",
        width: 1024,
        height: 768,
        src: {
          original: "https://example.com/photo2/original",
          large: "https://example.com/photo2/large",
          medium: "https://example.com/photo2/medium",
          small: "https://example.com/photo2/small",
          tiny: "https://example.com/photo2/tiny",
        },
        alt: "Photo 2",
        photographer: "Photographer 2",
        photographerUrl: "https://example.com/photographer2",
        avgColor: "#111111",
        source: "unsplash",
      },
    ];

    const mockData = {
      pages: [
        {
          photos: mockPhotos,
        },
      ],
    };

    const result = extractPhotosFromPages(mockData);
    expect(result).toEqual(mockPhotos);
  });

  it("should extract and flatten photos from multiple pages", () => {
    const mockPhotosPage1: IPhoto[] = [
      {
        id: "1",
        width: 800,
        height: 600,
        src: {
          original: "https://example.com/photo1/original",
          large: "https://example.com/photo1/large",
          medium: "https://example.com/photo1/medium",
          small: "https://example.com/photo1/small",
          tiny: "https://example.com/photo1/tiny",
        },
        alt: "Photo 1",
        photographer: "Photographer 1",
        photographerUrl: "https://example.com/photographer1",
        avgColor: "#eeeeee",
        source: "pexels",
      },
    ];

    const mockPhotosPage2: IPhoto[] = [
      {
        id: "2",
        width: 1024,
        height: 768,
        src: {
          original: "https://example.com/photo2/original",
          large: "https://example.com/photo2/large",
          medium: "https://example.com/photo2/medium",
          small: "https://example.com/photo2/small",
          tiny: "https://example.com/photo2/tiny",
        },
        alt: "Photo 2",
        photographer: "Photographer 2",
        photographerUrl: "https://example.com/photographer2",
        avgColor: "#111111",
        source: "unsplash",
      },
    ];

    const mockData = {
      pages: [
        {
          photos: mockPhotosPage1,
        },
        {
          photos: mockPhotosPage2,
        },
      ],
    };

    const result = extractPhotosFromPages(mockData);
    expect(result).toEqual([...mockPhotosPage1, ...mockPhotosPage2]);
  });

  it("should handle pages with empty arrays", () => {
    const mockPhotos: IPhoto[] = [
      {
        id: "1",
        width: 800,
        height: 600,
        src: {
          original: "https://example.com/photo1/original",
          large: "https://example.com/photo1/large",
          medium: "https://example.com/photo1/medium",
          small: "https://example.com/photo1/small",
          tiny: "https://example.com/photo1/tiny",
        },
        alt: "Photo 1",
        photographer: "Photographer 1",
        photographerUrl: "https://example.com/photographer1",
        avgColor: "#eeeeee",
        source: "pexels",
      },
    ];

    const mockData = {
      pages: [
        {
          photos: mockPhotos,
        },
        {
          photos: [],
        },
      ],
    };

    const result = extractPhotosFromPages(mockData);
    expect(result).toEqual(mockPhotos);
  });

  it("should handle pages with null photos arrays", () => {
    const mockPhotos: IPhoto[] = [
      {
        id: "1",
        width: 800,
        height: 600,
        src: {
          original: "https://example.com/photo1/original",
          large: "https://example.com/photo1/large",
          medium: "https://example.com/photo1/medium",
          small: "https://example.com/photo1/small",
          tiny: "https://example.com/photo1/tiny",
        },
        alt: "Photo 1",
        photographer: "Photographer 1",
        photographerUrl: "https://example.com/photographer1",
        avgColor: "#eeeeee",
        source: "pexels",
      },
    ];

    const mockData = {
      pages: [
        {
          photos: mockPhotos,
        },
        {
          photos: [] as IPhoto[],
        },
      ],
    };

    const result = extractPhotosFromPages(mockData);
    expect(result).toEqual(mockPhotos);
  });
});
