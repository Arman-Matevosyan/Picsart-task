import { ThemeToggle } from "@design-system/components/ThemeToggle";
import { FC } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import DynamicSearchBar from "./DynamicSearchBar";

const Header = styled.header`
  padding: 20px 0;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 100%;
`;

const HeaderContent = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  position: relative;

  @media (max-width: 600px) {
    padding: 0 10px;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  text-align: center;
  color: ${(props) => props.theme.colors.textPrimary};
  transition: color 0.3s ease;
  flex: 1;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const StyledThemeToggle = styled(ThemeToggle)`
  position: relative;

  @media (max-width: 480px) {
    transform: scale(0.8);
    margin-left: 8px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 480px) {
    transform: scale(0.8);
    margin-right: 8px;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: ${(props) => props.theme.colors.textPrimary};
  font-weight: bold;
  font-size: 1.2rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }

  svg {
    margin-right: 8px;
    height: 24px;
    width: 24px;
  }

  @media (max-width: 480px) {
    font-size: 1rem;

    svg {
      margin-right: 4px;
      height: 20px;
      width: 20px;
    }
  }
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
        <LogoContainer>
          <Logo to="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M4 5h13v7h2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
              <path d="M17 17.89V19h1.13c.64 0 1.15.51 1.15 1.15 0 .64-.51 1.15-1.15 1.15H17v1.1h1.13c1.24 0 2.25-1.01 2.25-2.25s-1.01-2.25-2.25-2.25H17v-.01zm-5-1.13V19h1.13c.64 0 1.15.51 1.15 1.15 0 .64-.51 1.15-1.15 1.15H12v1.1h1.13c1.24 0 2.25-1.01 2.25-2.25s-1.01-2.25-2.25-2.25H12v-.04zm8.5 1.53v5.21h1.13v-6.9H20.5v1.69zm-12-.73l-1.24 3.96h1.16l.23-.8h1.29l.24.8h1.16L8.1 17.56H7.5zm.18 2.27l.32-1.15.35 1.15H7.68z" />
            </svg>
            Picsart
          </Logo>
        </LogoContainer>
        <Title>{title}</Title>
        <StyledThemeToggle />
      </HeaderContent>
      {showSearch && <DynamicSearchBar initialValue={initialValue} />}
    </Header>
  );
};
