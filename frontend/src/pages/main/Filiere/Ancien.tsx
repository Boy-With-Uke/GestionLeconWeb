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
import "../../../assets/css/fonts.css";

export default function ListeFiliere() {
  type Filiere = {
    id_filiere: number;
    nomFiliere: string;
    nombreClasse: number;
  };
  type User = {
    id_user: number;
    nom: string;
    prenom: string;
    email: string;
    niveauAccess: string;
  };

  const [actualUser, setActualUser] = useState<User | null>(null);
  const [filiers, setFilieres] = useState<Filiere[]>([]);
  const userCookie = Cookies.get("user");
  const [actualFiliere, setActualFiliere] = useState<Filiere | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const filieresPerPage = 6;

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
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const getFilieres = async () => {
    try {
      const req = await fetch(`http://localhost:5173/api/filiere`);

      const data = await req.json();
      const filieres: Filiere[] = data.filieres.map((filiere: any) => ({
        id_filiere: filiere.id_filiere,
        nomFiliere: filiere.nomFiliere,
        nombreClasse: filiere.classes.length,
      }));
      console.log(filieres);
      setFilieres(filieres);
    } catch (error) {
      console.error("Error fetching filieres data:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Fetch user data
    getActualUser();
    getFilieres();

    // Clear the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  // Calculate start and end indices
  const startIndex = (currentPage - 1) * filieresPerPage;
  const endIndex = startIndex + filieresPerPage;

  // Get current filieres
  const currentFilieres = filiers.slice(startIndex, endIndex);

  // Change page
  const paginate = (pageNumber: number) => {
    if (
      pageNumber >= 1 &&
      pageNumber <= Math.ceil(filiers.length / filieresPerPage)
    ) {
      setCurrentPage(pageNumber);
    }
  };
  const handleCardClick = (filiereName: string) => {
    navigate(`/ListeClasseFiliere/${filiereName}`);
  };

  const handleDelete = async (id: number) => {
    try {
      const req = await fetch(`http://localhost:5173/api/filiere/${id}`, {
        method: "DELETE",
      });
      console.log(req);
      const data = await req.json();
      if (req.status === 200) {
        toast({
          title: `Success`,
          description: data.message || `Suppresion reussi`,
        });
        getFilieres();
      } else {
        toast({
          variant: "destructive",
          title: `Erreur`,
          description: `Erreur lors de la suppression`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditClick = async (filiere: Filiere) => {
    setActualFiliere(filiere);
    setIsEditDialogOpen(true);
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
        <div className="flex h-full">
          <Sidebar />
          <div className="flex flex-col w-full">
            <Navbar />
            <div className="flex-1 flex flex-col justify-center items-center pr-9 pl-9 bg-slate-100 dark:bg-slate-950">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {currentFilieres.map((filiere) => (
                  <div
                    className="context-menu-container"
                    key={filiere.id_filiere}
                  >
                    <Card
                      onClick={() => handleCardClick(filiere.nomFiliere)}
                      className="drop-shadow-xl shadow-black/10 bg-white dark:shadow-primary dark:bg-slate-900 cursor-pointer"
                      style={{ width: "200px" }} // Définir une largeur fixe pour les cartes
                    >
                      <CardHeader className="flex flex-row gap-4 items-center pb-2">
                        <div className="flex flex-col">
                          <CardTitle className="text-base">
                            {filiere.nomFiliere === ""
                              ? "Aucune personne connectée"
                              : filiere.nomFiliere}
                          </CardTitle>
                          <CardDescription>
                            Nombre de Classe: {filiere.nombreClasse}
                          </CardDescription>
                        </div>
                      </CardHeader>
                    </Card>
                  </div>
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
                    { length: Math.ceil(filiers.length / filieresPerPage) },
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
                    <PaginationNext onClick={() => paginate(currentPage + 1)} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
