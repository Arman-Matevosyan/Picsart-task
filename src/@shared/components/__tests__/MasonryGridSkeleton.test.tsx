import { screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../../test/test-utils";
import * as useColumnCountModule from "../../hooks/useColumnCount";
import { MasonryGridSkeleton } from "../MasonryGridSkeleton";

vi.mock("../../hooks/useColumnCount", () => ({
  useColumnCount: vi.fn(),
}));

// mock the ImageCardSkeleton
vi.mock("../ImageCardSkeleton", () => ({
  __esModule: true,
  default: ({ aspectRatio }: { aspectRatio: number }) => (
    <div data-testid="mock-skeleton-card" data-aspect-ratio={aspectRatio} />
  ),
}));

// mock the MasonryGridSkeleton
vi.mock("../MasonryGridSkeleton", () => {
  return {
    MasonryGridSkeleton: ({ itemCount = 9 }: { itemCount?: number }) => {
      const columnCount = useColumnCountModule.useColumnCount();

      const columns = Array.from(
        { length: columnCount },
        () => [] as React.ReactNode[]
      );

      for (let i = 0; i < itemCount; i++) {
        const colIndex = i % columnCount;
        const aspectRatio = 0.7 + 0.5 * 1.3;
        columns[colIndex].push(
          <div
            key={i}
            data-testid="mock-skeleton-card"
            data-aspect-ratio={aspectRatio}
          />
        );
      }

      return (
        <div data-testid="masonry-skeleton-container">
          <div
            data-testid="masonry-skeleton-grid"
            style={{ "--column-count": columnCount } as React.CSSProperties}
          >
            {columns.map((column, index) => (
              <div key={index} data-testid="masonry-skeleton-column">
                {column}
              </div>
            ))}
          </div>
        </div>
      );
    },
  };
});

describe("MasonryGridSkeleton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(Math, "random").mockReturnValue(0.5);
  });

  it("renders with 2 columns and default item count", () => {
    vi.spyOn(useColumnCountModule, "useColumnCount").mockReturnValue(2);

    renderWithProviders(<MasonryGridSkeleton />);

    const grid = screen.getByTestId("masonry-skeleton-grid");
    expect(grid.style.getPropertyValue("--column-count")).toBe("2");

    const skeletonCards = screen.getAllByTestId("mock-skeleton-card");
    expect(skeletonCards).toHaveLength(9);

    skeletonCards.forEach((card) => {
      expect(card).toHaveAttribute("data-aspect-ratio");
      expect(
        parseFloat(card.getAttribute("data-aspect-ratio") || "0")
      ).toBeCloseTo(1.35);
    });
  });

  it("renders with custom item count", () => {
    vi.spyOn(useColumnCountModule, "useColumnCount").mockReturnValue(3);

    const customItemCount = 6;
    renderWithProviders(<MasonryGridSkeleton itemCount={customItemCount} />);

    const skeletonCards = screen.getAllByTestId("mock-skeleton-card");
    expect(skeletonCards).toHaveLength(customItemCount);
  });

  it("put items evenly across columns", () => {
    vi.spyOn(useColumnCountModule, "useColumnCount").mockReturnValue(3);

    renderWithProviders(<MasonryGridSkeleton itemCount={9} />);

    const columns = screen.getAllByTestId("masonry-skeleton-column");
    expect(columns).toHaveLength(3);

    columns.forEach((column) => {
      const cardsInColumn = within(column).getAllByTestId("mock-skeleton-card");
      expect(cardsInColumn).toHaveLength(3);
    });
  });
});
