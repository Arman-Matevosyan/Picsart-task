import { FC } from "react";
import styled from "styled-components";
import { useColumnCount } from "../hooks";
import ImageCardSkeleton from "./ImageCardSkeleton";

interface MasonryGridSkeletonProps {
  itemCount?: number;
}

const OuterContainer = styled.div`
  position: relative;
  width: 100%;
`;

const GridContainer = styled.div`
  display: grid;
  gap: 16px;
  padding: 16px 0;
  grid-template-columns: repeat(var(--column-count), 1fr);
  width: 100%;
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MasonryGridSkeleton: FC<MasonryGridSkeletonProps> = ({
  itemCount = 9,
}) => {
  const columnCount = useColumnCount();
  
  // Generate random aspect ratios for the skeleton items
  const randomAspectRatios = Array.from(
    { length: itemCount },
    () => 0.7 + Math.random() * 1.3
  );

  // Distribute items into columns better by height
  const columns = Array.from({ length: columnCount }, () => [] as number[]);
  const colHeights: number[] = Array(columnCount).fill(0);

  // Add items to the shortest column
  randomAspectRatios.forEach((ratio) => {
    const shortestColIndex = colHeights.indexOf(Math.min(...colHeights));
    columns[shortestColIndex].push(ratio);
    colHeights[shortestColIndex] += ratio; // Use aspect ratio as height estimation
  });

  return (
    <OuterContainer>
      <GridContainer
        style={{ "--column-count": columnCount } as React.CSSProperties}
      >
        {columns.map((column, columnIndex) => (
          <ColumnContainer key={`skeleton-column-${columnIndex}`}>
            {column.map((aspectRatio, itemIndex) => (
              <ImageCardSkeleton 
                key={`skeleton-item-${columnIndex}-${itemIndex}`}
                aspectRatio={aspectRatio} 
              />
            ))}
          </ColumnContainer>
        ))}
      </GridContainer>
    </OuterContainer>
  );
};

export default MasonryGridSkeleton;
