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
  margin-bottom: 16px; // Match the margin in ImageCard component
  position: relative;
`;

const SkeletonImage = styled(Skeleton)`
  width: 100%;
  height: 0;
  position: relative;
  display: block;
`;

const InfoSkeleton = styled.div`
  margin-top: 8px;
`;

const ImageCardSkeleton: FC<ImageCardSkeletonProps> = ({
  aspectRatio = 1.5,
}) => {
  return (
    <SkeletonCard>
      <SkeletonImage style={{ paddingBottom: `${(1 / aspectRatio) * 100}%` }} />
      <InfoSkeleton>
        <Skeleton width="60%" height={14} />
        <Skeleton width="40%" height={12} style={{ marginTop: "4px" }} />
      </InfoSkeleton>
    </SkeletonCard>
  );
};

export default ImageCardSkeleton;
