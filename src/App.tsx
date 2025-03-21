import { useRoutes } from "react-router-dom";
import { GlobalStyles } from "./@design-system/theme";
import { ThemeProvider } from "./@shared/contexts/ThemeContext";
import { routes } from "./routes";

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
