import { Button } from "@design-system/components";
import { ChangeEvent, FC, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

interface SearchBarProps {
  initialValue?: string;
}

const Form = styled.form`
  display: flex;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 600px) {
    flex-direction: row;
    padding: 0 10px;
  }
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

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 0.9rem;
  }
`;

const SearchButton = styled(Button)`
  border-radius: 0 ${(props) => props.theme.borderRadius.medium}
    ${(props) => props.theme.borderRadius.medium} 0;
  margin-left: -1px;

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 0.9rem;
    white-space: nowrap;
  }
`;

export const SearchBar: FC<SearchBarProps> = ({ initialValue = "" }) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const navigate = useNavigate();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
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

export default SearchBar;
