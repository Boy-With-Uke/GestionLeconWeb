/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import DeleteForm from "@/components/forms/matiere-delete-form";
import EditForm from "@/components/forms/matiere-edit-form";
import OrbitingLoader from "@/components/main/OrbitingLoader";
import Sidebar from "@/components/main/Sidebar";
import IconMenu from "@/components/main/icon-menu";
import Navbar from "@/components/main/navbar";
import { ResponsiveDialog } from "@/components/main/responsive-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/components/ui/use-toast";
import { type ClasseMatiere, type Matiere, type User } from "@/types";
import { getActualUser } from "@/utils/function";
import Cookies from "js-cookie";
import { MoreVertical, SquarePen, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../../assets/css/fonts.css";
import { Input } from "@/components/ui/input";

function Item({
  matiere,
  getClasses: getClasses,
  onClick,
}: {
  matiere: Matiere;
  getClasses: () => void;
  onClick: () => void;
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const userCookie = Cookies.get("user");
  const [actualUser, setActualUser] = useState<User | null>(null);

  useEffect(() => {
    if (userCookie) {
      getActualUser(userCookie, setActualUser, toast, navigate);
    }
  }, []);

  const handleEditClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the click from propagating to the card
    setIsEditOpen(true);
    setMenuOpen(false); // Close the menu
  };

  const handleDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the click from propagating to the card
    setIsDeleteOpen(true);
    setMenuOpen(false); // Close the menu
  };

  return (
    <>
      <ResponsiveDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title={`Modification de la Matiere: ${matiere.nom}`}
      >
        <EditForm
          props={matiere}
          setIsOpen={setIsEditOpen}
          onSuccess={getClasses}
        />
      </ResponsiveDialog>
      <ResponsiveDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title={`Suppression de la Matiere: ${matiere.nom}`}
        description={`Êtes-vous sûr de vouloir supprimer la filière "${matiere.nom}" ?`}
      >
        <DeleteForm
          props={matiere}
          onSuccess={getClasses}
          setIsOpen={setIsDeleteOpen}
        />
      </ResponsiveDialog>
      <Card
        className="drop-shadow-xl shadow-black/10 bg-white dark:shadow-primary dark:bg-slate-900 relative hover:shadow-xl duration-200 transition-all cursor-pointer"
        style={{ width: "200px" }}
        onClick={onClick} // Attach the onClick handler here
      >
        <CardHeader className="flex flex-row gap-4 items-center pb-2">
          <div className="flex flex-col">
            <CardTitle className="text-base">
              {matiere.nom === "" ? "Aucune Classe" : matiere.nom}
            </CardTitle>
            <CardDescription>
              Nombre de Lecons+Evaluations: {matiere.lecon.length}
            </CardDescription>
          </div>
        </CardHeader>

        {actualUser?.niveauAccess === "ADMIN" ? (
          <>
            <div className="absolute right-4 top-4 z-10">
              <span>
                <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                      onClick={(e) => e.stopPropagation()} // Prevent click propagation to the card
                    >
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px] z-50">
                    <DropdownMenuItem className="group flex w-full items-center justify-between text-left p-0 text-sm font-base text-neutral-500">
                      <button
                        onClick={handleEditClick}
                        className="w-full justify-start flex rounded-md p-2 transition-all duration-75 hover:bg-neutral-100"
                      >
                        <IconMenu
                          text="Edit"
                          icon={<SquarePen className="h-4 w-4" />}
                        />
                      </button>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="group flex w-full items-center justify-between text-left p-0 text-sm font-base text-neutral-500">
                      <button
                        onClick={handleDeleteClick}
                        className="w-full justify-start flex text-red-500 rounded-md p-2 transition-all duration-75 hover:bg-neutral-100"
                      >
                        <IconMenu
                          text="Delete"
                          icon={<Trash2 className="h-4 w-4" />}
                        />
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </span>
            </div>
          </>
        ) : (
          <></>
        )}
      </Card>
    </>
  );
}

export default function ListeMatiere() {
  const { classeName } = useParams<{ classeName?: string }>();
  const userCookie = Cookies.get("user");
  const [actualUser, setActualUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const matieresPerPage = 6;

  const startIndex = (currentPage - 1) * matieresPerPage;
  const endIndex = startIndex + matieresPerPage;

  // Get current filieres

  // Change page
  const paginate = (pageNumber: number) => {
    if (
      pageNumber >= 1 &&
      pageNumber <= Math.ceil(matieres.length / matieresPerPage)
    ) {
      setCurrentPage(pageNumber);
    }
  };

  const getMatiere = async () => {
    try {
      const req = await fetch(`http://localhost:5173/api/matiere`);
      const data = await req.json();
      console.log(data); // Vérifiez la structure des données ici

      let matieres: Matiere[] = data.Matiere.map((matiere: any) => ({
        id_matiere: matiere.id_matiere,
        nom: matiere.nom,
        description: matiere.description,
        enseignant: matiere.enseignant,
        lecon: matiere.lecon,
        classeMatiere: matiere.classeMatiere, // Assurez-vous que cette propriété existe
      }));

      if (classeName) {
        matieres = matieres.filter((matiere) =>
          matiere.classeMatiere.some(
            (cm: ClasseMatiere) => cm.classes.nomClasse === classeName
          )
        );
      }

      setMatieres(matieres);
      console.log(matieres);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error fetching classes data:", error);
    }
  };

  useEffect(() => {
    // Fetch user data
    if (userCookie) {
      getActualUser(userCookie, setActualUser, toast, navigate);
    }
    getMatiere();
  }, []);
  const handleCardClick = (filiereName: string) => {
    navigate(`/ListeCours/${filiereName}`);
  };

  const [searchText, setSearchText] = useState("");
  const filteredMatieres = matieres.filter((matiere) =>
    matiere.nom.toLowerCase().includes(searchText.toLowerCase())
  );
  // Get current filieres
  const currentMatieres = filteredMatieres.slice(startIndex, endIndex);
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
              {matieres.length === 0 ? (
                <p className="text-5xl dark:text-primary">
                  Pas encore de matieres !!!
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
                    {currentMatieres.map((matiere) => (
                      <Item
                        key={matiere.id_matiere}
                        matiere={matiere}
                        onClick={() => handleCardClick(matiere.nom)}
                        getClasses={getMatiere}
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
                            filteredMatieres.length / matieresPerPage
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
