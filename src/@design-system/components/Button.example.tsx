import { createPropFilter } from "@design-system/utils/styleUtils";
import React, { ButtonHTMLAttributes } from "react";
import styled from "styled-components";

/**
 * Example of a Button component that demonstrates best practices for styled-components
 *
 * Performance optimizations:
 * 1. Uses createPropFilter to prevent DOM attribute pollution
 * 2. Uses transient props with $ prefix for styled-only props
 * 3. Implements proper memoization patterns
 */

// define button-specific props that will nnot be in DOM
const buttonPropFilter = createPropFilter(["isLoading", "iconPosition"]);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "text";
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
  fullWidth?: boolean;
  iconPosition?: "left" | "right";
  icon?: React.ReactNode;
}

// These dont pass to the DOM element
const StyledButton = styled.button.withConfig({
  shouldForwardProp: buttonPropFilter,
})<{
  $variant: "primary" | "secondary" | "text";
  $size: "small" | "medium" | "large";
  $fullWidth: boolean;
  $hasIcon: boolean;
  $iconPosition: "left" | "right";
}>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ $hasIcon }) => ($hasIcon ? "8px" : "0")};
  flex-direction: ${({ $iconPosition }) =>
    $iconPosition === "right" ? "row-reverse" : "row"};
  font-family: inherit;
  font-weight: 500;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  transition: all 0.2s ease;
  cursor: pointer;
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};

  /* Size styles */
  padding: ${({ $size }) =>
    $size === "small"
      ? "6px 12px"
      : $size === "medium"
      ? "8px 16px"
      : "10px 20px"};

  font-size: ${({ $size }) =>
    $size === "small" ? "14px" : $size === "medium" ? "16px" : "18px"};

  /* Variant styles */
  background-color: ${({ theme, $variant }) =>
    $variant === "primary"
      ? theme.colors.primary
      : $variant === "secondary"
      ? theme.colors.background
      : "transparent"};

  color: ${({ theme, $variant }) =>
    $variant === "primary" ? theme.colors.white : theme.colors.textPrimary};

  border: ${({ theme, $variant }) =>
    $variant === "secondary"
      ? `1px solid ${theme.colors.border}`
      : $variant === "text"
      ? "none"
      : `1px solid ${theme.colors.primary}`};

  &:hover {
    background-color: ${({ theme, $variant }) =>
      $variant === "primary"
        ? theme.colors.primaryDark
        : $variant === "secondary"
        ? theme.colors.divider
        : theme.colors.divider + "50"};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  position: absolute;
  left: calc(50% - 8px);

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// Main component with optimized rendering
export const Button = React.memo<ButtonProps>(
  ({
    children,
    variant = "primary",
    size = "medium",
    isLoading = false,
    fullWidth = false,
    iconPosition = "left",
    icon,
    disabled,
    ...props
  }) => {
    // Derive hasIcon from icon prop to avoid unnecessary props
    const hasIcon = Boolean(icon);

    return (
      <StyledButton
        $variant={variant}
        $size={size}
        $fullWidth={fullWidth}
        $hasIcon={hasIcon}
        $iconPosition={iconPosition}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <LoadingSpinner />}
        <span style={{ opacity: isLoading ? 0 : 1 }}>
          {icon && icon}
          {children}
        </span>
      </StyledButton>
    );
  }
);

// Add display name for debugging
Button.displayName = "Button";
