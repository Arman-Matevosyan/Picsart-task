import { FC, ImgHTMLAttributes, useState } from "react";
import styled from "styled-components";

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: number;
  fit?: "cover" | "contain" | "fill";
  rounded?: boolean;
  placeholderColor?: string;
}

interface StyledImageProps {
  $loaded: boolean;
  $aspectRatio?: number;
  $fit?: "cover" | "contain" | "fill";
  $rounded?: boolean;
  $placeholderColor?: string;
}

const ImageContainer = styled.div<StyledImageProps>`
  position: relative;
  overflow: hidden;
  width: 100%;

  ${(props) =>
    props.$aspectRatio &&
    `
    aspect-ratio: ${props.$aspectRatio};
  `}

  ${(props) =>
    props.$rounded &&
    `
    border-radius: ${props.theme.borderRadius.medium};
  `}
  
  background-color: ${(props) =>
    props.$placeholderColor || props.theme.colors.divider};
`;

const StyledImage = styled.img<StyledImageProps>`
  width: 100%;
  height: 100%;
  object-fit: ${(props) => props.$fit || "cover"};
  opacity: ${(props) => (props.$loaded ? 1 : 0)};
  transition: opacity 0.3s ease;
  position: absolute;
  top: 0;
  left: 0;

  ${(props) =>
    props.$rounded &&
    `
    border-radius: ${props.theme.borderRadius.medium};
  `}
`;

export const Image: FC<ImageProps> = ({
  src,
  alt,
  aspectRatio,
  fit = "cover",
  rounded = false,
  placeholderColor = "#e0e0e0",
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <ImageContainer
      $loaded={loaded}
      $aspectRatio={aspectRatio}
      $rounded={rounded}
      $placeholderColor={placeholderColor}
    >
      <StyledImage
        src={src}
        alt={alt || "Image"}
        $loaded={loaded}
        $fit={fit}
        $rounded={rounded}
        onLoad={() => setLoaded(true)}
        loading="lazy" // lazy loading
        {...props}
      />
    </ImageContainer>
  );
};

export default Image;
