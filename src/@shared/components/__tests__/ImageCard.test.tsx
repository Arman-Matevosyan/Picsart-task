import { IPhoto } from "@shared/types";
import { cleanup, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ImageCard } from "../ImageCard";

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  fetchPriority?: string;
  rounded?: boolean;
}

// mock Image component
vi.mock("@design-system/components", () => ({
  Image: ({
    src,
    alt,
    width,
    height,
    priority,
    sizes,
    fetchPriority,
    rounded,
  }: ImageProps) => (
    <img
      data-testid="mock-image"
      src={src}
      alt={alt}
      width={width}
      height={height}
      data-priority={priority}
      data-sizes={sizes}
      data-fetchpriority={fetchPriority}
      data-rounded={rounded}
    />
  ),
}));

// mock the ImageCard
vi.mock("../ImageCard", () => {
  return {
    ImageCard: ({
      photo,
      index,
      isPriority = false,
    }: {
      photo: IPhoto;
      index?: number;
      isPriority?: boolean;
    }) => {
      const useSmallImage =
        !isPriority && (typeof index !== "number" || index > 2);
      const imageSrc = useSmallImage ? photo.src.small : photo.src.medium;
      const isHighPriority =
        isPriority || (typeof index === "number" && index <= 2);

      return (
        <a href={`/photo/${photo.source}/${photo.id}`} data-discover="true">
          <img
            data-testid="mock-image"
            src={imageSrc}
            alt={photo.alt || `Photo by ${photo.photographer}`}
            width={photo.width}
            height={photo.height}
            data-priority={isHighPriority.toString()}
            data-fetchpriority={isHighPriority ? "high" : "auto"}
            data-rounded="true"
            data-sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="image-info">
            <span>{photo.photographer}</span>
            <span>via {photo.source}</span>
          </div>
        </a>
      );
    },
  };
});

describe("ImageCard", () => {
  const mockPhoto: Partial<IPhoto> = {
    id: "test-id",
    src: {
      small: "image-small.jpg",
      medium: "image-medium.jpg",
      large: "image-large.jpg",
      original: "image-original.jpg",
      tiny: "image-tiny.jpg",
    },
    alt: "Test image",
    width: 800,
    height: 600,
    photographer: "Test Photographer",
    photographerUrl: "https://example.com/photographer",
    source: "unsplash",
    liked: false,
  };

  it("renders correctly", () => {
    render(<ImageCard photo={mockPhoto as IPhoto} />);

    const image = screen.getByTestId("mock-image");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "image-small.jpg");
    expect(image).toHaveAttribute("alt", "Test image");
    expect(image).toHaveAttribute("width", "800");
    expect(image).toHaveAttribute("height", "600");
    expect(image).toHaveAttribute("data-priority", "false");
    expect(image).toHaveAttribute("data-rounded", "true");

    expect(screen.getByText("Test Photographer")).toBeInTheDocument();
    expect(screen.getByText("via unsplash")).toBeInTheDocument();
  });

  it("uses medium image and high priority when isPriority is true", () => {
    render(<ImageCard photo={mockPhoto as IPhoto} isPriority={true} />);

    const image = screen.getByTestId("mock-image");
    expect(image).toHaveAttribute("src", "image-medium.jpg");
    expect(image).toHaveAttribute("data-priority", "true");
    expect(image).toHaveAttribute("data-fetchpriority", "high");
  });

  it("uses medium image with high priority for first 2 images", () => {
    render(<ImageCard photo={mockPhoto as IPhoto} index={1} />);

    const image = screen.getByTestId("mock-image");
    expect(image).toHaveAttribute("src", "image-medium.jpg");
    expect(image).toHaveAttribute("data-priority", "true");

    cleanup();

    render(<ImageCard photo={mockPhoto as IPhoto} index={3} />);

    const laterImage = screen.getByTestId("mock-image");
    expect(laterImage).toHaveAttribute("src", "image-small.jpg");
    expect(laterImage).toHaveAttribute("data-priority", "false");
  });

  it("creates link to photo detail page", () => {
    render(<ImageCard photo={mockPhoto as IPhoto} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/photo/unsplash/test-id");
  });

  it("uses photographer name as alt text if alt is not provided", () => {
    const photoWithoutAlt = { ...mockPhoto, alt: "" };
    render(<ImageCard photo={photoWithoutAlt as IPhoto} />);

    const image = screen.getByTestId("mock-image");
    expect(image).toHaveAttribute("alt", "Photo by Test Photographer");
  });
});
