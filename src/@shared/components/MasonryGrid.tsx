import { ReactNode, memo, useMemo } from "react";
import styled from "styled-components";
import { useColumnCount } from "../hooks";

/**
 * Performance-optimized MasonryGrid component
 *
 * Optimizations applied:
 * - Memoized column components to prevent unnecessary re-renders
 * - Efficient item distribution algorithm
 * - Minimum height reservation to prevent layout shifts
 *
 * References:
 * - Stack Overflow: https://stackoverflow.com/questions/53165945/does-react-memo-improve-performance
 * - Dev.to (Femi Akinyemi): https://dev.to/femak/preventing-unnecessary-re-rendering-in-react-components-5c96
 */

const OuterContainer = styled.div`
  position: relative;
  min-height: 80vh; /* Prevent full page layout shift while loading */
`;

const GridContainer = styled.div`
  display: grid;
  gap: 16px;
  padding: 16px 0;
  grid-template-columns: repeat(var(--column-count), 1fr);
  width: 100%;

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

function MasonryColumnComponent<T>({
  items,
  renderItem,
  columnIndex,
  columnCount,
}: {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  columnIndex: number;
  columnCount: number;
}) {
  return (
    <ColumnContainer>
      {items.map((item, itemIndex) => {
        // calc the absolute index for priority
        const absoluteIndex = columnIndex + itemIndex * columnCount;
        return renderItem(item, absoluteIndex);
      })}
    </ColumnContainer>
  );
}

const MasonryColumn = memo(
  MasonryColumnComponent
) as typeof MasonryColumnComponent;

interface MasonryGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  loadingElement?: ReactNode;
  sentinelElement?: ReactNode;
}

export const MasonryGrid = <T,>({
  items,
  renderItem,
  loadingElement,
  sentinelElement,
}: MasonryGridProps<T>) => {
  const columnCount = useColumnCount();

  // pre-calculate columns to minimize DOM updates
  const columns = useMemo(() => {
    const cols: T[][] = Array.from({ length: columnCount }, () => []);
    const colHeights: number[] = Array(columnCount).fill(0);

    // pass items to columns
    items.forEach((item) => {
      const shortestColIndex = colHeights.indexOf(Math.min(...colHeights));
      cols[shortestColIndex].push(item);
      colHeights[shortestColIndex] += 1;
    });

    return cols;
  }, [items, columnCount]);

  return (
    <OuterContainer>
      <GridContainer
        style={{ "--column-count": columnCount } as React.CSSProperties}
      >
        {columns.map((column, colIndex) => (
          <MasonryColumn<T>
            key={`column-${colIndex}`}
            items={column}
            renderItem={renderItem}
            columnIndex={colIndex}
            columnCount={columnCount}
          />
        ))}
      </GridContainer>
      {loadingElement}
      {sentinelElement}
    </OuterContainer>
  );
};
