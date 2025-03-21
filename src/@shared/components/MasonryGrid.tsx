import { ReactNode } from "react";
import styled from "styled-components";
import { useColumnCount } from "../hooks";

const GridContainer = styled.div`
  display: grid;
  gap: 16px;
  padding: 16px 0;
  grid-template-columns: repeat(var(--column-count), 1fr);

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

interface MasonryGridProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
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

  return (
    <div style={{ position: "relative" }}>
      <GridContainer
        style={{ "--column-count": columnCount } as React.CSSProperties}
      >
        {items.map((item, index) => (
          <div key={index}>{renderItem(item)}</div>
        ))}
      </GridContainer>
      {loadingElement}
      {sentinelElement}
    </div>
  );
};
