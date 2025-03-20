import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  html, body, #root {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.textPrimary};
    transition: background-color 0.3s ease, color 0.3s ease;
    font-family: ${(props) => props.theme.typography.fontFamily};
  }
  
  * {
    box-sizing: border-box;
  }
  
  a {
    color: ${(props) => props.theme.colors.primary};
    text-decoration: none;
  }
  
  ::selection {
    background-color: ${(props) => props.theme.colors.primary}40;
  }
`;

export default GlobalStyles;
