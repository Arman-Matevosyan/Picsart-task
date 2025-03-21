import { Image } from "@design-system/components";
import { IPhoto } from "@shared/types";
import { FC, memo } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

interface ImageCardProps {
  photo: IPhoto;
}

const Card = styled(Link)`
  display: block;
  width: 100%;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);

    .image-info {
      opacity: 1;
    }
  }
`;

const ImageInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  color: #fff;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  @media (max-width: 768px) {
    opacity: 1; // Always visible on mobile
  }
`;

const Photographer = styled.span`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
`;

const Source = styled.span`
  font-size: 12px;
  opacity: 0.8;
`;

export const ImageCard: FC<ImageCardProps> = ({ photo }) => {
  const aspectRatio = photo.width / photo.height;

  return (
    <Card to={`/photo/${photo.source}/${photo.id}`}>
      <Image
        src={photo.src.medium}
        alt={photo.alt}
        aspectRatio={aspectRatio}
        rounded
      />
      <ImageInfo className="image-info">
        <Photographer>{photo.photographer}</Photographer>
        <Source>via {photo.source}</Source>
      </ImageInfo>
    </Card>
  );
};

export default memo(ImageCard, (prevProps, nextProps) => {
  return prevProps.photo.id === nextProps.photo.id;
});
