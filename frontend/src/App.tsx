import { ThemeProvider } from "@/components/theme-provider";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Acceuil from "./pages/Acceuil";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import Profil from "./pages/Profil";
import Test from "./pages/Test";
import Test2 from "./pages/Test2";
import { ListeUser } from "./pages/main/ListeUser";
import AjoutFiliere from "./pages/main/Filiere/AjoutFiliere";
import AjoutClasse from "./pages/main/Classe/AjoutClasse";
import AjoutMatiere from "./pages/main/Matiere/AjoutMatiere";
import ListeFiliere from "./pages/main/Filiere/ListeFiliere";
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Acceuil />} />
          <Route path="/Connexion" element={<Connexion />} />
          <Route path="/Inscription" element={<Inscription />} />
          <Route path="/Test" element={<Test />} />
          <Route path="/Test2" element={<Test2 />} />
          <Route path="/Profil" element={<Profil />} />
          <Route path="/ListeUser" element={<ListeUser />} />
          <Route path="/AjoutFiliere" element={<AjoutFiliere />} />
          <Route path="/AjoutClasse" element={<AjoutClasse />} />
          <Route path="/AjoutMatiere" element={<AjoutMatiere />} />
          <Route path="/ListeFiliere" element={<ListeFiliere />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
