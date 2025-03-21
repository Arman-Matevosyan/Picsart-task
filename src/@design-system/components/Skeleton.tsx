import { CSSProperties, FC } from "react";
import styled, { keyframes } from "styled-components";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
  style?: CSSProperties;
}

const pulse = keyframes`
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.6;
  }
`;

const SkeletonContainer = styled.div<{
  $width?: string | number;
  $height?: string | number;
  $borderRadius?: string;
}>`
  width: ${(props) =>
    typeof props.$width === "number"
      ? `${props.$width}px`
      : props.$width || "100%"};
  height: ${(props) =>
    typeof props.$height === "number"
      ? `${props.$height}px`
      : props.$height || "100%"};
  border-radius: ${(props) =>
    props.$borderRadius || props.theme.borderRadius.medium};
  background-color: ${(props) => props.theme.colors.skeleton};
  animation: ${pulse} 1.5s ease-in-out infinite;
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0,
      rgba(255, 255, 255, 0.1) 20%,
      rgba(255, 255, 255, 0.2) 60%,
      rgba(255, 255, 255, 0)
    );
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
`;

export const Skeleton: FC<SkeletonProps> = ({
  width,
  height,
  borderRadius,
  className,
  style,
}) => {
  return (
    <SkeletonContainer
      $width={width}
      $height={height}
      $borderRadius={borderRadius}
      className={className}
      style={style}
    />
  );
};

export default Skeleton;
