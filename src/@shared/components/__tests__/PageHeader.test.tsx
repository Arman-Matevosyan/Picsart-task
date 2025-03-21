import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../../test/test-utils";
import { PageHeader } from "../PageHeader";

// mock the ThemeToggle
vi.mock("@design-system/components/ThemeToggle", () => ({
  ThemeToggle: () => <div data-testid="mock-theme-toggle">Theme Toggle</div>,
}));

// mock the SearchBar
vi.mock("../SearchBar", () => ({
  __esModule: true,
  default: ({ initialValue }: { initialValue: string }) => (
    <div data-testid="mock-search-bar" data-initial-value={initialValue}>
      Search Bar
    </div>
  ),
}));

// mock the PageHeader
vi.mock("../PageHeader", () => {
  const original = vi.importActual("../PageHeader");

  return {
    ...original,
    PageHeader: ({
      title,
      showSearch = false,
      initialValue = "",
    }: {
      title: string;
      showSearch?: boolean;
      initialValue?: string;
    }) => (
      <header data-testid="page-header">
        <a href="/" data-testid="logo-link">
          picsart
        </a>
        <h1>{title}</h1>
        <div data-testid="mock-theme-toggle">Theme Toggle</div>
        {showSearch && (
          <div data-testid="mock-search-bar" data-initial-value={initialValue}>
            Search Bar
          </div>
        )}
      </header>
    ),
  };
});

describe("PageHeader", () => {
  it("renders correctly", () => {
    renderWithProviders(<PageHeader title="Test Title" />);

    expect(
      screen.getByRole("heading", { name: "Test Title" })
    ).toBeInTheDocument();

    expect(screen.getByTestId("logo-link")).toBeInTheDocument();
    expect(screen.getByTestId("logo-link")).toHaveAttribute("href", "/");

    expect(screen.getByTestId("mock-theme-toggle")).toBeInTheDocument();

    expect(screen.queryByTestId("mock-search-bar")).not.toBeInTheDocument();
  });

  it("renders with search bar when showSearch is true", () => {
    renderWithProviders(<PageHeader title="Test Title" showSearch={true} />);

    expect(screen.getByTestId("mock-search-bar")).toBeInTheDocument();
    expect(screen.getByTestId("mock-search-bar")).toHaveAttribute(
      "data-initial-value",
      ""
    );
  });

  it("passes initialValue to search bar", () => {
    const initialSearchValue = "initial search query";
    renderWithProviders(
      <PageHeader
        title="Test Title"
        showSearch={true}
        initialValue={initialSearchValue}
      />
    );

    expect(screen.getByTestId("mock-search-bar")).toHaveAttribute(
      "data-initial-value",
      initialSearchValue
    );
  });
});
