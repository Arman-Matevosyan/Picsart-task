import { Button, ThemeToggle } from "@design-system/components";
import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
}

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 16px;
  min-height: 100%;
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.textPrimary};
  transition: background-color 0.3s ease, color 0.3s ease;

  @media (max-width: 768px) {
    padding: 0 8px;
  }
`;

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
  font-size: 2.5rem;
  text-align: center;
  color: ${(props) => props.theme.colors.textPrimary};
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const StyledThemeToggle = styled(ThemeToggle)`
  position: absolute;
  right: 0;
`;

const BackButton = styled(Button)`
  position: absolute;
  left: 0;
  display: inline-flex;
  align-items: center;

  &::before {
    content: "←";
    margin-right: 8px;
  }
`;

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  title = "Picsart Gallery",
  showBackButton = false,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Container>
      <Header>
        <HeaderContent>
          {showBackButton && (
            <BackButton variant="text" onClick={handleBack}>
              Back
            </BackButton>
          )}
          <Title>{title}</Title>
          <StyledThemeToggle />
        </HeaderContent>
      </Header>
      {children}
    </Container>
  );
};

export default AppLayout;
