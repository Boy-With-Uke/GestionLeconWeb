import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Connexion from "./pages/Connexion";
import Test from "./pages/Test";
import Inscription from "./pages/Inscription";
import Acceuil from "./pages/Acceuil";
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Acceuil />} />
          <Route path="/Connexion" element={<Connexion />} />
          <Route path="/Inscription" element={<Inscription />} />
          <Route path="/" element={<Test />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
