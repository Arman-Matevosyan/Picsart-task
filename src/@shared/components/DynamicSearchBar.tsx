import { FC, lazy, Suspense, useState } from "react";
import styled from "styled-components";

/**
 * Dynamic SearchBar that only loads when needed
 *
 * This improves initial page load by deferring the SearchBar code until it's needed
 * Reference: https://developer.chrome.com/docs/lighthouse/performance/uses-text-compression
 */

// lazy load the actual SearchBar component
const SearchBar = lazy(() => import("./SearchBar"));

interface DynamicSearchBarProps {
  initialValue?: string;
}

const SearchContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  min-height: 48px; /* Reserve space for the search bar */

  @media (max-width: 768px) {
    max-width: 100%;
  }

  @media (max-width: 480px) {
    min-height: 42px;
  }
`;

const SearchPlaceholder = styled.div`
  width: 100%;
  height: 48px;
  background-color: ${(props) => props.theme.colors.divider};
  border-radius: ${(props) => props.theme.borderRadius.medium};
  opacity: 0.6;

  @media (max-width: 480px) {
    height: 42px;
  }
`;

export const DynamicSearchBar: FC<DynamicSearchBarProps> = ({
  initialValue = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // load the search bar after a short delay or when user interacts with the page
  // this helps prioritize more important content first
  setTimeout(() => setIsVisible(true), 100);

  return (
    <SearchContainer>
      {isVisible ? (
        <Suspense fallback={<SearchPlaceholder />}>
          <SearchBar initialValue={initialValue} />
        </Suspense>
      ) : (
        <SearchPlaceholder />
      )}
    </SearchContainer>
  );
};

export default DynamicSearchBar;
