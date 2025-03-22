import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../../test/test-utils";
import ImageCardSkeleton from "../ImageCardSkeleton";

interface SkeletonProps {
  height?: number | string;
  style?: React.CSSProperties;
  "data-testid"?: string;
}

vi.mock("@design-system/components", () => ({
  Skeleton: ({ height, style, ...props }: SkeletonProps) => (
    <div
      data-testid={props["data-testid"] || "mock-skeleton"}
      data-height={height}
      style={style}
    />
  ),
}));

describe("ImageCardSkeleton", () => {
  it("renders with default aspect ratio (1.5)", () => {
    renderWithProviders(<ImageCardSkeleton />);

    const skeletons = screen.getAllByTestId("mock-skeleton");
    const imageSkeleton = skeletons.find((skeleton) =>
      skeleton.style.paddingBottom?.includes("%")
    );

    expect(imageSkeleton).toBeInTheDocument();
    expect(parseFloat(imageSkeleton?.style.paddingBottom || "0")).toBeCloseTo(
      66.67,
      1
    );
  });

  it("renders with custom aspect ratio", () => {
    const customAspectRatio = 2;
    renderWithProviders(<ImageCardSkeleton aspectRatio={customAspectRatio} />);

    const skeletons = screen.getAllByTestId("mock-skeleton");
    const imageSkeleton = skeletons.find((skeleton) =>
      skeleton.style.paddingBottom?.includes("%")
    );

    expect(imageSkeleton).toBeInTheDocument();
    expect(imageSkeleton?.style.paddingBottom).toBe("50%");
  });
});
