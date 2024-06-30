/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
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
import { Input } from "@/components/ui/input";
type Matiere = {
  nom: string;
};

type MatiereLesson = {
  matiere: Matiere;
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

function Item({
  lesson,
  getClasses: getClasses,
  onClick,
}: {
  lesson: Lesson;
  getClasses: () => void;
  onClick: () => void;
}) {
  return (
    <>
      <Card
        className="drop-shadow-xl shadow-black/10 bg-white dark:shadow-primary dark:bg-slate-900 relative hover:shadow-xl duration-200 transition-all cursor-pointer"
        style={{ width: "200px" }}
        onClick={onClick} // Attach the onClick handler here
      >
        <CardHeader className="flex flex-row gap-4 items-center pb-2">
          <div className="flex flex-col">
            <CardTitle className="text-base">
              {lesson.titre === "" ? "Aucune Classe" : lesson.titre}
            </CardTitle>
            <CardDescription className="text-center flex flex-row">
              Type de cours: {lesson.typeLecon}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </>
  );
}

export default function ListeFavoris() {
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

        const lessonsContainer = data.user.lessons;

        let lessonsGeted: Lesson[] = lessonsContainer.map(
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

        setLessons(lessonsGeted);
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
        // Indicate that loading is done
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  useEffect(() => {
    getActualUser();
  }, [userCookie]);

  const startIndex = (currentPage - 1) * lessonsPerPage;
  const endIndex = startIndex + lessonsPerPage;

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
  const [searchText, setSearchText] = useState("");
  const filteredCourses = lessons.filter((lesson) =>
    lesson.titre.toLowerCase().includes(searchText.toLowerCase())
  );
  // Get current filieres
  const currentCours = filteredCourses.slice(startIndex, endIndex);

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
        <div className="flex h-full">
          <Sidebar />
          <div className="flex flex-col w-full">
            <Navbar />
            <div className="flex-1 flex flex-col justify-center items-center pr-9 pl-9 bg-slate-100 dark:bg-slate-950">
              {lessons.length === 0 ? (
                <p className="text-5xl dark:text-primary">
                  Pas encore de cours !!!
                </p>
              ) : (
                <>
                  <div className="flex w-full justify-center items-center py-4 pb-9">
                    <Input
                      placeholder="Filtrer les noms..."
                      className="max-w-sm"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                  </div>
                  <div className="w-full grid grid-cols-1 sm:grid-cols-4 gap-4">
                    {" "}
                    {currentCours.map((lesson) => (
                      <Item
                        key={lesson.id_lecon}
                        lesson={lesson}
                        onClick={() => handleCardClick(lesson.id_lecon)}
                        getClasses={getActualUser}
                      />
                    ))}
                  </div>

                  <Pagination className="mt-10">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => paginate(currentPage - 1)}
                        />
                      </PaginationItem>
                      {Array.from(
                        {
                          length: Math.ceil(
                            filteredCourses.length / lessonsPerPage
                          ),
                        },
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
