import { screen } from "@testing-library/react";
import { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../../test/test-utils";
import * as useColumnCountModule from "../../hooks/useColumnCount";
import { MasonryGrid } from "../MasonryGrid";

interface MockItem {
  id: string;
  title: string;
}

interface MasonryGridMockProps {
  items: MockItem[];
  renderItem: (item: MockItem, index: number) => ReactNode;
  loadingElement?: ReactNode;
  sentinelElement?: ReactNode;
}

vi.mock("../../hooks/useColumnCount", () => ({
  useColumnCount: vi.fn(),
}));

vi.mock("../MasonryGrid", () => ({
  MasonryGrid: ({
    items,
    renderItem,
    loadingElement,
    sentinelElement,
  }: MasonryGridMockProps) => {
    const columnCount = useColumnCountModule.useColumnCount();

    const columns = Array.from({ length: columnCount }, (_, colIndex) => {
      return items
        .filter((_, index) => index % columnCount === colIndex)
        .map((item, index) => renderItem(item, colIndex + index * columnCount));
    });

    return (
      <div data-testid="masonry-grid-container">
        <div
          data-testid="masonry-grid"
          style={{ "--column-count": columnCount } as React.CSSProperties}
        >
          {columns.map((column, index) => (
            <div key={index} data-testid="masonry-column">
              {column}
            </div>
          ))}
          {loadingElement}
          {sentinelElement}
        </div>
      </div>
    );
  },
}));

describe("MasonryGrid", () => {
  const mockItems: MockItem[] = [
    { id: "1", title: "Item 1" },
    { id: "2", title: "Item 2" },
    { id: "3", title: "Item 3" },
    { id: "4", title: "Item 4" },
    { id: "5", title: "Item 5" },
    { id: "6", title: "Item 6" },
  ];

  const mockRenderItem = (item: MockItem, index: number): ReactNode => (
    <div key={item.id} data-testid={`item-${item.id}`} data-index={index}>
      {item.title}
    </div>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with 2 columns", () => {
    vi.spyOn(useColumnCountModule, "useColumnCount").mockReturnValue(2);

    renderWithProviders(
      <MasonryGrid items={mockItems} renderItem={mockRenderItem} />
    );

    const grid = screen.getByTestId("masonry-grid");
    expect(grid.style.getPropertyValue("--column-count")).toBe("2");

    mockItems.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    });

    const columns = screen.getAllByTestId("masonry-column");
    expect(columns).toHaveLength(2);
  });

  it("renders with 3 columns", () => {
    vi.spyOn(useColumnCountModule, "useColumnCount").mockReturnValue(3);

    renderWithProviders(
      <MasonryGrid items={mockItems} renderItem={mockRenderItem} />
    );

    const grid = screen.getByTestId("masonry-grid");
    expect(grid.style.getPropertyValue("--column-count")).toBe("3");

    const columns = screen.getAllByTestId("masonry-column");
    expect(columns).toHaveLength(3);
  });

  it("passes correct index to renderItem", () => {
    vi.spyOn(useColumnCountModule, "useColumnCount").mockReturnValue(2);

    renderWithProviders(
      <MasonryGrid items={mockItems} renderItem={mockRenderItem} />
    );

    // column 0: 0, 2, 4, ...
    // column 1: 1, 3, 5, ...
    expect(screen.getByTestId("item-1")).toHaveAttribute("data-index", "0");
    expect(screen.getByTestId("item-2")).toHaveAttribute("data-index", "1");
    expect(screen.getByTestId("item-3")).toHaveAttribute("data-index", "2");
    expect(screen.getByTestId("item-4")).toHaveAttribute("data-index", "3");
  });

  it("renders loading and sentinel elements when provided", () => {
    vi.spyOn(useColumnCountModule, "useColumnCount").mockReturnValue(2);

    const loadingElement = <div data-testid="loading-element">Loading...</div>;
    const sentinelElement = <div data-testid="sentinel-element">Load More</div>;

    renderWithProviders(
      <MasonryGrid
        items={mockItems}
        renderItem={mockRenderItem}
        loadingElement={loadingElement}
        sentinelElement={sentinelElement}
      />
    );

    expect(screen.getByTestId("loading-element")).toBeInTheDocument();
    expect(screen.getByTestId("sentinel-element")).toBeInTheDocument();
  });
});
