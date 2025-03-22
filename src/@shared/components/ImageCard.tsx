import { Image } from "@design-system/components";
import { IPhoto } from "@shared/types";
import { memo } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

interface ImageCardProps {
  photo: IPhoto;
  isPriority?: boolean;
  index?: number;
}

const Card = styled(Link)`
  display: block;
  position: relative;
  margin-bottom: 16px;
  border-radius: ${(props) => props.theme.borderRadius.medium};
  overflow: hidden;
  transition: transform 0.2s ease-in-out;
  width: 100%;

  &:hover {
    transform: translateY(-4px);

    .image-info {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ImageInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 16px;
  background: linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  color: white;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  border-bottom-left-radius: ${(props) => props.theme.borderRadius.medium};
  border-bottom-right-radius: ${(props) => props.theme.borderRadius.medium};
`;

const Photographer = styled.p`
  font-size: 14px;
  font-weight: 500;
  margin: 0;
`;

const Source = styled.p`
  font-size: 12px;
  margin: 4px 0 0;
  opacity: 0.8;
`;

// memo for unnecessary re-renders
export const ImageCard = memo<ImageCardProps>(
  ({ photo, isPriority = false, index = 0 }) => {
    const isImportantImage = isPriority || index < 4;

    // Responsive sizes based on viewport and grid layout
    // - Small screens: full width minus padding (calc(100vw - 32px))
    // - Medium screens: half width minus gaps (calc(50vw - 24px))
    // - Large screens: third width minus gaps (calc(33.333vw - 32px))
    const sizes =
      "(max-width: 640px) calc(100vw - 16px), (max-width: 1024px) calc(50vw - 12px), calc(33.333vw - 16px)";

    const getOptimalImageSize = () => {
      // for important images (top of page, LCP candidates), use higher quality
      if (isImportantImage) {
        return photo.src.large;
      }

      // for most gallery images, medium is sufficient
      return photo.src.medium;
    };

    const imageSrc = getOptimalImageSize();

    return (
      <Card to={`/photo/${photo.source}/${photo.id}`}>
        <Image
          src={imageSrc}
          alt={photo.alt || `Photo by ${photo.photographer}`}
          width={photo.width}
          height={photo.height}
          priority={isImportantImage}
          sizes={sizes}
          fetchPriority={isImportantImage ? "high" : "auto"}
          rounded
          placeholderColor={photo.avgColor || "#e0e0e0"}
        />
        <ImageInfo className="image-info">
          <Photographer>{photo.photographer}</Photographer>
          <Source>via {photo.source}</Source>
        </ImageInfo>
      </Card>
    );
  }
);

// for debugging
ImageCard.displayName = "ImageCard";
