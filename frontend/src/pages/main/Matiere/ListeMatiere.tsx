"use client";
import OrbitingLoader from "@/components/OrbitingLoader";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/navbar";
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

export default function ListeMatiere() {
  const { classeName } = useParams<{ classeName?: string }>();

  type enseignant = {
    nom: string;
    prenom: string;
  };

  type Matiere = {
    id_matiere: number;
    nom: string;
    description: string;
    enseignant: enseignant;
    lecon: number;
    classMatiere: classeMatiere;
  };

  type classeMatiere = {
    classes: classes;
  };
  type classes = {
    nomClasse: string;
  };
  type User = {
    id_user: number;
    nom: string;
    prenom: string;
    email: string;
    niveauAccess: string;
  };

  const [actualUser, setActualUser] = useState<User | null>(null);
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const userCookie = Cookies.get("user");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const MatieresPerPage = 6;

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

  const getClasses = async () => {
    try {
      const req = await fetch(`http://localhost:5173/api/matiere`);
      const data = await req.json();

      let matieres: Matiere[] = data.Matiere.map((matiere: any) => ({
        id_matiere: matiere.id_matiere,
        nom: matiere.nom,
        description: matiere.description,
        enseignant: matiere.enseignant,
        lecon: matiere.lecon.length,
      }));

      if (classeName) {
        matieres = matieres.filter(
          (matiere) => matiere.classMatiere.classes.nomClasse === classeName
        );
      }

      setMatieres(matieres);
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
  }, [classeName]);

  // Calculate start and end indices
  const startIndex = (currentPage - 1) * MatieresPerPage;
  const endIndex = startIndex + MatieresPerPage;

  // Get current filieres
  const currentMatieres = matieres.slice(startIndex, endIndex);

  // Change page
  const paginate = (pageNumber: number) => {
    if (
      pageNumber >= 1 &&
      pageNumber <= Math.ceil(matieres.length / MatieresPerPage)
    ) {
      setCurrentPage(pageNumber);
    }
  };

  const handleCardClick = (filiereName: string) => {
    navigate(`/filiere/${filiereName}`);
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
              {matieres.length === 0 ? (
                <p className="text-5xl dark:text-primary">
                  Pas encore de classe !!!
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {currentMatieres.map((matiere) => (
                      <Card
                        key={matiere.id_matiere}
                        onClick={() => handleCardClick(matiere.nom)}
                        className="drop-shadow-xl shadow-black/10 bg-white dark:shadow-primary dark:bg-slate-900 cursor-pointer"
                        style={{ width: "200px" }}
                      >
                        <CardHeader className="flex flex-row gap-4 items-center pb-2">
                          <div className="flex flex-col">
                            <CardTitle className="text-base">
                              {matiere.nom === ""
                                ? "Aucune personne connectée"
                                : matiere.nom}
                            </CardTitle>
                            <CardDescription>
                              Nombre de Lecons: {matiere.lecon}  
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
                        {
                          length: Math.ceil(matieres.length / MatieresPerPage),
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
