import { Theme } from "@design-system/theme/theme";
import { ButtonHTMLAttributes, FC, ReactNode } from "react";
import styled, { css } from "styled-components";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outlined" | "text";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  children: ReactNode;
}

// using $variant and $size for styled components not to pass them to DOM
interface StyledButtonProps {
  $variant?: "primary" | "secondary" | "outlined" | "text";
  $size?: "small" | "medium" | "large";
  $fullWidth?: boolean;
}

const BaseButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.small};
  cursor: pointer;
  font-family: ${(props) => props.theme.typography.fontFamily};
  font-weight: 500;
  transition: all 0.2s ease;

  ${(props) => {
    switch (props.$size) {
      case "small":
        return css`
          padding: 6px 16px;
          font-size: 0.875rem;
        `;
      case "large":
        return css`
          padding: 12px 32px;
          font-size: 1.125rem;
        `;
      default: // medium
        return css`
          padding: 8px 24px;
          font-size: 1rem;
        `;
    }
  }}

  ${(props) =>
    props.$fullWidth &&
    css`
      width: 100%;
    `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${(props) => {
    const theme = props.theme as Theme;

    switch (props.$variant) {
      case "secondary":
        return css`
          background-color: ${theme.colors.secondary};
          color: ${theme.colors.onSecondary};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.secondaryDark};
          }
          &:active:not(:disabled) {
            transform: translateY(1px);
          }
        `;
      case "outlined":
        return css`
          background-color: transparent;
          color: ${theme.colors.primary};
          border: 1px solid ${theme.colors.primary};
          &:hover:not(:disabled) {
            background-color: rgba(98, 0, 238, 0.04);
          }
          &:active:not(:disabled) {
            transform: translateY(1px);
          }
        `;
      case "text":
        return css`
          background-color: transparent;
          color: ${theme.colors.primary};
          padding-left: 8px;
          padding-right: 8px;
          &:hover:not(:disabled) {
            background-color: rgba(98, 0, 238, 0.04);
          }
          &:active:not(:disabled) {
            transform: translateY(1px);
          }
        `;
      default:
        return css`
          background-color: ${theme.colors.primary};
          color: ${theme.colors.onPrimary};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primaryDark};
          }
          &:active:not(:disabled) {
            transform: translateY(1px);
          }
        `;
    }
  }}
`;

export const Button: FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  ...props
}) => {
  return (
    <BaseButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      {...props}
    >
      {children}
    </BaseButton>
  );
};

export default Button;
