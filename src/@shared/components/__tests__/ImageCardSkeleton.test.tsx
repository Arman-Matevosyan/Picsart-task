import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../../test/test-utils";
import ImageCardSkeleton from "../ImageCardSkeleton";

interface SkeletonProps {
  height?: number | string;
  style?: React.CSSProperties;
}

// mock Skeleton
vi.mock("@design-system/components", () => ({
  Skeleton: ({ height, style }: SkeletonProps) => (
    <div data-testid="mock-skeleton" data-height={height} style={style} />
  ),
}));

describe("ImageCardSkeleton", () => {
  it("renders with default aspect ratio (1.5)", () => {
    renderWithProviders(<ImageCardSkeleton />);

    const skeleton = screen.getByTestId("mock-skeleton");
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute("data-height", "0");

    expect(parseFloat(skeleton.style.paddingBottom)).toBeCloseTo(66.67, 1);
  });

  it("renders with custom aspect ratio", () => {
    const customAspectRatio = 2;
    renderWithProviders(<ImageCardSkeleton aspectRatio={customAspectRatio} />);

    const skeleton = screen.getByTestId("mock-skeleton");
    expect(skeleton).toBeInTheDocument();

    expect(skeleton.style.paddingBottom).toBe("50%");
  });
});
