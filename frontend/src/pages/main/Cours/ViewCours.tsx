"use client";
import OrbitingLoader from "@/components/OrbitingLoader";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/navbar";
import { useToast } from "@/components/ui/use-toast";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import '../../../assets/css/fonts.css';
// PDF
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
// Icons
import { ScrollToTop } from "@/components/ScrollToTop";
import { CardDescription } from "@/components/ui/card";
import { Heart, HeartFill } from "react-bootstrap-icons"; // Assurez-vous d'importer une icône de cœur appropriée

export default function ViewCours() {
  const { coursId: coursId } = useParams<{ coursId?: string }>();

  type matiere = {
    nom: string;
  };

  type matiereLesson = {
    matiere: matiere;
  };

  type Lesson = {
    id_lecon: number;
    titre: string;
    contenue: string;
    type: string;
    matiereLesson: matiereLesson[];
  };

  type User = {
    id_user: number;
    nom: string;
    prenom: string;
    email: string;
    niveauAccess: string;
  };

  const [actualUser, setActualUser] = useState<User | null>(null);
  const [cours, setCours] = useState<Lesson | null>(null);
  const userCookie = Cookies.get("user");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const getActualUser = async () => {
    if (!userCookie) {
      toast({
        variant: "destructive",
        title: `Erreur`,
        description: "Vous devez vous connecter pour accéder à cette ressource",
      });
      navigate("/");
      return;
    } else {
      try {
        const res = await fetch(`http://localhost:5173/api/user/${userCookie}`);
        if (!res.ok) {
          console.error("Failed to fetch user data:", res.statusText);
          return;
        }
        const data = await res.json();
        const user: User = data.user;
        setActualUser(user);
        if (data.user.niveauAccess !== "ADMIN") {
          toast({
            variant: "destructive",
            title: `Erreur`,
            description: `Ressources indisponibles pour votre niveau d'accès`,
          });
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  const getLessons = async () => {
    try {
      const req = await fetch(`http://localhost:5173/api/lesson/${coursId}`);
      const data = await req.json();

      const lessonData = data.lessons;
      const matiereNames = lessonData.matiereLesson.map(
        (ml: matiereLesson) => ml.matiere.nom
      );

      const lesson: Lesson = {
        id_lecon: lessonData.id_lecon,
        titre: lessonData.titre,
        contenue: lessonData.contenue,
        type: lessonData.type,
        matiereLesson: lessonData.matiereLesson,
      };

      setCours(lesson);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error fetching classes data:", error);
    }
  };

  useEffect(() => {
    getActualUser();
    getLessons();
  }, [coursId]);

  return (
    <>
      {isLoading ? (
        <div
          className="flex justify-center items-center bg-white dark:bg-gray-950/90"
          style={{
            height: "100vh",
          }}
        >
          <OrbitingLoader />
        </div>
      ) : (
        <div className="flex h-screen">
          <div className="sticky h-full">
            <Sidebar />
          </div>
          <div className="flex flex-col w-full">
            <Navbar />
            <div className="flex-1 flex flex-col pr-9 pl-9 bg-slate-100 dark:bg-slate-950">
              {cours ? (
                <>
                  <div className="mt-16 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h1
                        className="dark:text-primary text-xl font-bold"
                        style={{ fontFamily: "Raleway" }}
                      >
                        {cours.titre.toUpperCase()}
                      </h1>
                      <button
                        onClick={toggleFavorite}
                        className="flex items-center space-x-2 text-primary"
                      >
                        {isFavorite ? (
                          <>
                            <HeartFill className="text-primary" />
                            <span>Est déjà dans vos favoris</span>
                          </>
                        ) : (
                          <>
                            <Heart className="text-primary" />
                            <span>Favoris</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div>
                      <CardDescription>
                        {cours.matiereLesson
                          .map((ml) => ml.matiere.nom)
                          .join(", ")}
                        , {cours.type.toLocaleLowerCase()}
                      </CardDescription>
                    </div>
                  </div>
                  <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    <div
                      className="pl-24 pr-24 pb-7 dark:border-primary h-[90%]"
                    >
                      <Viewer fileUrl={cours.contenue} />
                    </div>
                  </Worker>
                </>
              ) : (
                <p className="text-white">Leçon non trouvée</p>
              )}
            </div>
          </div>
          <ScrollToTop />
        </div>
      )}
    </>
  );
}
