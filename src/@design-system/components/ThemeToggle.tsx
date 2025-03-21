import { useTheme } from "@shared/index";
import React from "react";
import styled from "styled-components";

interface ThemeToggleProps {
  className?: string;
}

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: ${(props) => props.theme.colors.textPrimary};
  background-color: ${(props) => props.theme.colors.backgroundSecondary};
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.divider};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${(props) => props.theme.colors.primary};
  }
`;

// SVG icons for sun and moon
const SunIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="4" fill="currentColor" />
    <path
      d="M12 5V3M12 21v-2M5 12H3m18 0h-2M6.36 6.36 5 5m14 14-1.36-1.36M6.36 17.64 5 19m14-14-1.36 1.36"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const MoonIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.24 17.954A8.014 8.014 0 0 1 7.3 18.82a8 8 0 0 1 4.102-15.14c-1.212.84-2.203 1.91-2.893 3.16-1.004 1.813-1.374 3.916-1.054 5.985.32 2.059 1.358 3.9 2.928 5.204.974.808 2.107 1.385 3.328 1.694a8.005 8.005 0 0 1-2.95.23z"
      fill="currentColor"
    />
  </svg>
);

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <ToggleButton
      className={className}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </ToggleButton>
  );
};

export default ThemeToggle;
