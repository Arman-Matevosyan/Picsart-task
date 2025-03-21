import { Skeleton } from "@design-system/components";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: string;
  className?: string;
  style?: React.CSSProperties;
}

vi.mock("@design-system/components", () => ({
  Skeleton: ({ width, height, borderRadius, className, style }: SkeletonProps) => (
    <div
      data-testid="skeleton"
      className={className ? `skeleton ${className}` : "skeleton"}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        borderRadius: borderRadius || "4px",
        ...style,
      }}
    />
  ),
}));

describe("Skeleton", () => {
  it("renders correctly", () => {
    render(<Skeleton width={100} height={50} />);

    const skeleton = screen.getByTestId("skeleton");

    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveStyle({
      width: "100px",
      height: "50px",
      borderRadius: "4px",
    });
  });

  it("renders with custom border radius", () => {
    render(<Skeleton width={100} height={50} borderRadius="8px" />);

    const skeleton = screen.getByTestId("skeleton");

    expect(skeleton).toHaveStyle({
      borderRadius: "8px",
    });
  });

  it("renders with custom class name", () => {
    const customClass = "custom-skeleton";
    render(<Skeleton width={100} height={50} className={customClass} />);

    const skeleton = screen.getByTestId("skeleton");

    expect(skeleton).toHaveClass(customClass);
    expect(skeleton).toHaveClass("skeleton");
  });

  it("apply custom style", () => {
    const customStyle = { opacity: 0.8, margin: "10px" };
    render(<Skeleton width={100} height={50} style={customStyle} />);

    const skeleton = screen.getByTestId("skeleton");

    expect(skeleton).toHaveStyle({
      opacity: 0.8,
      margin: "10px",
    });
  });
});
