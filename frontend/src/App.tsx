import { ThemeProvider } from "@/components/main/theme-provider";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Acceuil from "./pages/Acceuil";
import Connexion from "./pages/Connexion";
import FiliereDetails from "./pages/FilieresDetails";
import Inscription from "./pages/Inscription";
import Profil from "./pages/Profil";
import Test from "./pages/Test";
import Test2 from "./pages/Test2";
import AjoutClasse from "./pages/main/Classe/AjoutClasse";
import ListeClasseFiliere from "./pages/main/Classe/ListeClasseFiliere";
import AjoutEvaluation from "./pages/main/Cours/Evaluations/AjoutEvaluations";
import ListeEvaluation from "./pages/main/Cours/Evaluations/ListeEvaluations";
import AjoutLecon from "./pages/main/Cours/Lecon/AjoutLecon";
import ListeLecon from "./pages/main/Cours/Lecon/ListeLecon";
import ListeCours from "./pages/main/Cours/ListeCours";
import ListeFavoris from "./pages/main/Cours/ListeFavoris";
import ViewCours from "./pages/main/Cours/ViewCours";
import AjoutFiliere from "./pages/main/Filiere/AjoutFiliere";
import ListeFiliere from "./pages/main/Filiere/ListeFiliere";
import { ListeUser } from "./pages/main/ListeUser";
import AjoutMatiere from "./pages/main/Matiere/AjoutMatiere";
import ListeMatiere from "./pages/main/Matiere/ListeMatiere";
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

          <Route path="/ListeClasseFiliere" element={<ListeClasseFiliere />} />
          <Route
            path="/ListeClasseFiliere/:filiereName"
            element={<ListeClasseFiliere />}
          />
          <Route path="/ListeMatiere/:className" element={<ListeMatiere />} />
          <Route path="/ListeMatiere" element={<ListeMatiere />} />
          <Route path="/AjoutLecon" element={<AjoutLecon />} />
          <Route path="/AjoutEvaluation" element={<AjoutEvaluation />} />
          <Route path="/ListeCours/:subjectName" element={<ListeCours />} />
          <Route path="/ListeCours/" element={<ListeCours />} />
          <Route path="/ListeLecon/" element={<ListeLecon />} />
          <Route path="/ListeEvaluation/" element={<ListeEvaluation />} />
          <Route path="/ListeFavoris/" element={<ListeFavoris />} />
          <Route path="/View/:coursId" element={<ViewCours />} />
          <Route path="/filiere/:filiereName" element={<FiliereDetails />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
