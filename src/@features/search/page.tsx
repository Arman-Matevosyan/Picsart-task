import { Button } from "@design-system/components";
import { ChangeEvent, FC, FormEvent, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { useSearch } from "./hooks/useSearch";

const Form = styled.form`
  display: flex;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px 16px;
  border: 2px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.medium} 0 0
    ${(props) => props.theme.borderRadius.medium};
  font-size: 1rem;
  outline: none;
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.textPrimary};
  transition: border-color 0.3s ease, background-color 0.3s ease,
    color 0.3s ease;

  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

const SearchButton = styled(Button)`
  border-radius: 0 ${(props) => props.theme.borderRadius.medium}
    ${(props) => props.theme.borderRadius.medium} 0;
  margin-left: -1px;
`;

/**
 * SearchBar component for searching photos
 * Self-contained component that manages its own state and interactions
 */
export const Search: FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { handleSearch, query } = useSearch();
  const location = useLocation();

  // Initialize search query from URL when on search page
  useEffect(() => {
    if (location.pathname === "/search") {
      const urlQuery = new URLSearchParams(location.search).get("q") || "";
      if (urlQuery && urlQuery !== searchQuery) {
        setSearchQuery(urlQuery);
      }
    }
  }, [location.pathname, location.search, searchQuery]);

  // Keep local state in sync with store
  useEffect(() => {
    if (query && query !== searchQuery) {
      setSearchQuery(query);
    }
  }, [query, searchQuery]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      handleSearch(searchQuery.trim());
      // Blur the input after submitting to hide the keyboard on mobile
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit} role="search">
      <Input
        ref={inputRef}
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder="Search for photos..."
        aria-label="Search input"
      />
      <SearchButton type="submit" variant="primary">
        Search
      </SearchButton>
    </Form>
  );
};
