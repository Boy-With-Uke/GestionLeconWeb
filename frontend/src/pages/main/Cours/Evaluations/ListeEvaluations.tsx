"use client";
import OrbitingLoader from "@/components/main/OrbitingLoader";
import Sidebar from "@/components/main/Sidebar";
import Navbar from "@/components/main/navbar";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/components/ui/use-toast";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ListeEvaluationq() {
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
    matiereLesson: string[];
  };

  type User = {
    id_user: number;
    nom: string;
    prenom: string;
    email: string;
    niveauAccess: string;
  };

  const [actualUser, setActualUser] = useState<User | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const userCookie = Cookies.get("user");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const lessonsPerPage = 6;

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
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  const getLessons = async () => {
    try {
      const req = await fetch(`http://localhost:5173/api/lesson`);
      if (!req.ok) {
        console.error("Failed to fetch evaluations data:", req.statusText);
        return;
      }
      const data = await req.json();
      const res = data.lessons;

      let lessonsGeted: Lesson[] = res.map((lesson: any) => {
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
      });

      setLessons(
        lessonsGeted.filter((lesson) => lesson.typeLecon === "EVALUATION")
      );

      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      // Indicate that loading is done
    } catch (error) {
      console.error("Error fetching evaluations data:", error);
    }
  };

  useEffect(() => {
    getActualUser();
    getLessons();
  }, [userCookie]);

  const startIndex = (currentPage - 1) * lessonsPerPage;
  const endIndex = startIndex + lessonsPerPage;

  const currentLessons = lessons.slice(startIndex, endIndex);

  const paginate = (pageNumber: number) => {
    if (
      pageNumber >= 1 &&
      pageNumber <= Math.ceil(lessons.length / lessonsPerPage)
    ) {
      setCurrentPage(pageNumber);
    }
  };

  const handleCardClick = (id: number) => {
    navigate(`/View/${id}`);
  };

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
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex flex-col w-full">
            <Navbar />
            <div className="flex-1 flex flex-col justify-center items-center pr-9 pl-9 bg-slate-100 dark:bg-slate-950">
              {lessons.length === 0 ? (
                <p className="text-5xl dark:text-primary">
                  Pas encore d'Evaluations !!!
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {currentLessons.map((lesson) => (
                      <Card
                        key={lesson.id_lecon}
                        onClick={() => handleCardClick(lesson.id_lecon)}
                        className="drop-shadow-xl shadow-black/10 bg-white dark:shadow-primary dark:bg-slate-900 cursor-pointer"
                        style={{ width: "250px" }}
                      >
                        <CardHeader className="flex flex-row gap-4 items-center pb-2">
                          <div className="flex flex-col">
                            <CardTitle className="text-base">
                              {lesson.titre === ""
                                ? "Aucune personne connectée"
                                : lesson.titre}
                            </CardTitle>
                            <CardDescription>
                              Type de cours: {lesson.typeLecon}
                            </CardDescription>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => paginate(currentPage - 1)}
                        />
                      </PaginationItem>
                      {Array.from(
                        { length: Math.ceil(lessons.length / lessonsPerPage) },
                        (_, i) => (
                          <PaginationItem key={i + 1}>
                            <PaginationLink
                              href="#"
                              onClick={() => paginate(i + 1)}
                              isActive={i + 1 === currentPage}
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => paginate(currentPage + 1)}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
