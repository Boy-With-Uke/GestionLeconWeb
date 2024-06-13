import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Connexion from "./pages/Connexion";
import Test from "./pages/Test";
import { ThemeProvider } from "@/components/theme-provider";
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Connexion />} />
          <Route path="/Test" element={<Test />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
