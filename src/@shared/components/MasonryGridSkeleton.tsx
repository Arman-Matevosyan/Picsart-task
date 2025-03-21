import { FC } from "react";
import styled from "styled-components";
import ImageCardSkeleton from "./ImageCardSkeleton";

interface MasonryGridSkeletonProps {
  columnCount?: number;
  itemCount?: number;
  gap?: number;
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;

const Column = styled.div<{ $gap: number }>`
  display: flex;
  flex-direction: column;
  padding: 0 ${(props) => props.$gap / 2}px;
`;

const ItemWrapper = styled.div<{ $gap: number }>`
  margin-bottom: ${(props) => props.$gap}px;
`;

export const MasonryGridSkeleton: FC<MasonryGridSkeletonProps> = ({
  columnCount = 3,
  itemCount = 9,
  gap = 16,
}) => {
  // random aspect ratios for the skeleton
  const randomAspectRatios = Array.from(
    { length: itemCount },
    () => 0.7 + Math.random() * 1.3
  );

  const columns = Array.from({ length: columnCount }, () => [] as number[]);

  randomAspectRatios.forEach((ratio, index) => {
    columns[index % columnCount].push(ratio);
  });

  return (
    <Container>
      {columns.map((column, columnIndex) => (
        <Column
          key={`skeleton-column-${columnIndex}`}
          $gap={gap}
          style={{ width: `${100 / columnCount}%` }}
        >
          {column.map((aspectRatio, itemIndex) => (
            <ItemWrapper
              key={`skeleton-item-${columnIndex}-${itemIndex}`}
              $gap={gap}
            >
              <ImageCardSkeleton aspectRatio={aspectRatio} />
            </ItemWrapper>
          ))}
        </Column>
      ))}
    </Container>
  );
};
