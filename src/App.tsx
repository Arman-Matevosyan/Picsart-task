import { GlobalStyles } from "@design-system/theme/global-styles";
import { ThemeProvider } from "@shared/contexts/ThemeContext";
import { useRoutes } from "react-router-dom";
import routes from "./routes";

function App() {
  const routeElement = useRoutes(routes);

  return (
    <ThemeProvider>
      <GlobalStyles />
      {routeElement}
    </ThemeProvider>
  );
}

export default App;
