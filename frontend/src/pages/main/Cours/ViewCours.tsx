/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import OrbitingLoader from "@/components/main/OrbitingLoader";
import Sidebar from "@/components/main/Sidebar";
import Navbar from "@/components/main/navbar";
import { useToast } from "@/components/ui/use-toast";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../../assets/css/fonts.css";
// PDF
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
// Icons
import { ScrollToTop } from "@/components/main/ScrollToTop";
import { CardDescription } from "@/components/ui/card";
import { Download, Heart, HeartFill } from "react-bootstrap-icons";
import "../../../assets/css/animations.css";

export default function ViewCours() {
  const { coursId: coursId } = useParams<{ coursId?: string }>();

  type Lessonliste = {
    id_lecon: number;
    titre: string;
    contenue: string;
    typeLecon: string;
    matiereLesson: string[];
  };

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
    typeLecon: string;
    matiereLesson: matiereLesson[];
  };

  type User = {
    id_user: number;
    nom: string;
    prenom: string;
    email: string;
    niveauAccess: string;
    lessons: Lessonliste[];
  };

  //TODO: get actual user
  const [actualUser, setActualUser] = useState<User | null>(null);
  const [cours, setCours] = useState<Lesson | null>(null);
  const userCookie = Cookies.get("user");
  const [lessons, setLessons] = useState<Lessonliste[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

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

        const lessonsContainer = data.user.lessons;

        const lessonsGeted: Lessonliste[] = lessonsContainer.map(
          (lessonWrapper: any) => {
            const lesson = lessonWrapper.lessons;
            const matiereNames = lesson.matiereLesson.map(
              (ml: any) => ml.matiere.nom
            );
            return {
              id_lecon: lesson.id_lecon,
              titre: lesson.titre,
              contenue: lesson.contenue,
              typeLecon: lesson.typeLecon,
              matiereLesson: matiereNames,
            };
          }
        );

        setLessons(
          lessonsGeted.filter((lesson) => lesson.typeLecon === "LESSON")
        );

        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
        // Indicate that loading is done// Indicate that loading is done
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  const setFavorite = async (id: number) => {
    if (coursId) {
      try {
        const req = await fetch(`http://localhost:5173/api/user/fav/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_lecon: parseInt(coursId),
          }),
        });

        // Toggle favorite state with animation
        setIsTransitioning(true);
        setTimeout(() => {
          setIsFavorite(!isFavorite);
          setIsTransitioning(false);
        }, 300); // Match duration with CSS animation duration
      } catch (error) {
        console.log(error);
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
        typeLecon: lessonData.typeLecon,
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
                        onClick={() => setFavorite(actualUser?.id_user ?? 0)}
                        className="flex items-center space-x-2 text-primary"
                      >
                        {isFavorite ? (
                          <div
                            className={`${
                              isTransitioning ? "fade-exit" : "fade-enter"
                            } flex items-center space-x-2`}
                          >
                            <HeartFill className="text-primary" />
                            <span>Est déjà dans vos favoris</span>
                          </div>
                        ) : (
                          <div
                            className={`${
                              isTransitioning ? "fade-exit" : "fade-enter"
                            } flex items-center space-x-2`}
                          >
                            <Heart className="text-primary" />
                            <span>Ajouter aux favoris</span>
                          </div>
                        )}
                      </button>
                      <a
                        href={cours.contenue}
                        download={cours.titre}
                        className="flex items-center space-x-2 text-primary"
                      >
                        <Download className="text-primary" />
                        <span>Télécharger</span>
                      </a>
                    </div>
                    <div>
                      <CardDescription>
                        {cours.matiereLesson
                          .map((ml) => ml.matiere.nom)
                          .join(", ")}
                        , {cours.typeLecon.toLocaleLowerCase()}
                      </CardDescription>
                    </div>
                  </div>
                  <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    <div className="pl-24 pr-24 pb-7 dark:border-primary h-[90%]">
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
