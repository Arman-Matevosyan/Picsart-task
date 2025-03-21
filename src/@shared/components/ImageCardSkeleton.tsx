import { Skeleton } from "@design-system/components";
import { FC } from "react";
import styled from "styled-components";

interface ImageCardSkeletonProps {
  aspectRatio?: number;
}

const SkeletonCard = styled.div`
  width: 100%;
  overflow: hidden;
  border-radius: ${(props) => props.theme.borderRadius.medium};
`;

const ImageCardSkeleton: FC<ImageCardSkeletonProps> = ({
  aspectRatio = 1.5,
}) => {
  return (
    <SkeletonCard>
      <Skeleton
        height={0}
        style={{ paddingBottom: `${(1 / aspectRatio) * 100}%` }}
      />
    </SkeletonCard>
  );
};

export default ImageCardSkeleton;
