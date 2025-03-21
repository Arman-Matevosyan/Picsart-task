import { ThemeToggle } from "@design-system/components/ThemeToggle";
import { FC } from "react";
import styled from "styled-components";
import SearchBar from "./SearchBar";

const Header = styled.header`
  padding: 20px 0;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const HeaderContent = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  position: relative;
`;

const Title = styled.h1`
  font-size: 2rem;
  text-align: center;
  color: ${(props) => props.theme.colors.textPrimary};
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const StyledThemeToggle = styled(ThemeToggle)`
  position: absolute;
  right: 0;
`;

interface PageHeaderProps {
  title: string;
  showSearch?: boolean;
  initialValue?: string;
}

export const PageHeader: FC<PageHeaderProps> = ({
  title,
  showSearch = false,
  initialValue = "",
}) => {
  return (
    <Header>
      <HeaderContent>
        <Title>{title}</Title>
        <StyledThemeToggle />
      </HeaderContent>
      {showSearch && <SearchBar initialValue={initialValue} />}
    </Header>
  );
};
