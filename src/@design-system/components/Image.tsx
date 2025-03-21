import { FC, ImgHTMLAttributes, useEffect, useState } from "react";
import styled from "styled-components";

/**
 * Optimized Image component for better performance
 *
 * Optimizations applied:
 * - WebP format support for Unsplash images (reduced file size)
 * - Proper image preloading for better LCP
 * - Aspect ratio preservation to prevent CLS
 * - FetchPriority support for critical images
 *
 * References:
 * - Chrome Web Dev: https://web.dev/lcp/
 * - Dev.to (Daine Mawer): https://dev.to/daine/stop-your-website-from-jumping-around-cumulative-layout-shift-2aoo
 */
interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: number;
  fit?: "cover" | "contain" | "fill";
  rounded?: boolean;
  placeholderColor?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
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
  height: 0;
  padding-bottom: ${(props) =>
    props.$aspectRatio ? `${(1 / props.$aspectRatio) * 100}%` : "100%"};

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
  priority = false,
  width,
  height,
  sizes = "100vw",
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);

  const calculatedAspectRatio =
    aspectRatio || (width && height ? width / height : undefined);

  // convert URLs to WebP format when possible for Unsplash images
  const optimizedSrc =
    src && src.includes("unsplash.com")
      ? `${src}${src.includes("?") ? "&" : "?"}fm=webp&auto=format`
      : src;

  useEffect(() => {
    if (priority && optimizedSrc) {
      // preload LCP image with the correct mime type
      const preloadLink = document.createElement("link");
      preloadLink.rel = "preload";
      preloadLink.as = "image";
      preloadLink.href = optimizedSrc;

      // add type hint for WebP images
      if (optimizedSrc && optimizedSrc.includes("fm=webp")) {
        preloadLink.setAttribute("type", "image/webp");
      }

      document.head.appendChild(preloadLink);

      return () => {
        if (document.head.contains(preloadLink)) {
          document.head.removeChild(preloadLink);
        }
      };
    }
  }, [priority, optimizedSrc]);

  return (
    <ImageContainer
      $loaded={loaded}
      $aspectRatio={calculatedAspectRatio}
      $rounded={rounded}
      $placeholderColor={placeholderColor}
    >
      <StyledImage
        src={optimizedSrc}
        alt={alt || "Image"}
        $loaded={loaded}
        $fit={fit}
        $rounded={rounded}
        onLoad={() => setLoaded(true)}
        loading={priority ? "eager" : "lazy"}
        width={width}
        height={height}
        sizes={sizes}
        fetchPriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
        {...props}
      />
    </ImageContainer>
  );
};

export default Image;
