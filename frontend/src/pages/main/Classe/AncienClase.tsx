/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { useNavigate, useParams } from "react-router-dom";

export default function ListeClasseFiliere() {
  const { filiereName } = useParams<{ filiereName?: string }>();

  type ClasseFiliere = {
    nomFiliere: string;
  };

  type Classe = {
    id_classe: number;
    nomClasse: string;
    classeMatiere: number;
    classeFiliere: ClasseFiliere;
  };

  type User = {
    id_user: number;
    nom: string;
    prenom: string;
    email: string;
    niveauAccess: string;
  };

  const [actualUser, setActualUser] = useState<User | null>(null);
  const [classes, setClasses] = useState<Classe[]>([]);
  const userCookie = Cookies.get("user");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const classesPerPage = 6;

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

  const getClasses = async () => {
    try {
      const req = await fetch(`http://localhost:5173/api/classe`);
      const data = await req.json();

      let classes: Classe[] = data.classes.map((classe: any) => ({
        id_classe: classe.id_classe,
        nomClasse: classe.nomClasse,
        classeMatiere: classe.classeMatiere.length,
        classeFiliere: classe.classeFiliere,
      }));

      if (filiereName) {
        classes = classes.filter(
          (classe) => classe.classeFiliere.nomFiliere === filiereName
        );
      }

      setClasses(classes);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error fetching classes data:", error);
    }
  };

  useEffect(() => {
    // Fetch user data
    getActualUser();
    getClasses();
  }, [filiereName]);

  // Calculate start and end indices
  const startIndex = (currentPage - 1) * classesPerPage;
  const endIndex = startIndex + classesPerPage;

  // Get current filieres
  const currentClasses = classes.slice(startIndex, endIndex);

  // Change page
  const paginate = (pageNumber: number) => {
    if (
      pageNumber >= 1 &&
      pageNumber <= Math.ceil(classes.length / classesPerPage)
    ) {
      setCurrentPage(pageNumber);
    }
  };

  const handleCardClick = (classeName: string) => {
    navigate(`/ListeMatiere/${classeName}`);
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
              {classes.length === 0 ? (
                <p className="text-5xl dark:text-primary">
                  Pas encore de classe !!!
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {currentClasses.map((classe) => (
                      <Card
                        key={classe.id_classe}
                        onClick={() => handleCardClick(classe.nomClasse)}
                        className="drop-shadow-xl shadow-black/10 bg-white dark:shadow-primary dark:bg-slate-900 cursor-pointer"
                        style={{ width: "200px" }}
                      >
                        <CardHeader className="flex flex-row gap-4 items-center pb-2">
                          <div className="flex flex-col">
                            <CardTitle className="text-base">
                              {classe.nomClasse === ""
                                ? "Aucune personne connectée"
                                : classe.nomClasse}
                            </CardTitle>
                            <CardDescription>
                              Nombre de Matiere: {classe.classeMatiere}
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
                        { length: Math.ceil(classes.length / classesPerPage) },
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
