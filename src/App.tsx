import { useRoutes } from "react-router-dom";
import routes from "./routes";

function App() {
  const routeElement = useRoutes(routes);

  return <ThemeProvider>{routeElement}</ThemeProvider>;
}

export default App;
