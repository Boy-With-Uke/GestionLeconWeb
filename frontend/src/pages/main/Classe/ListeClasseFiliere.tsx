/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import OrbitingLoader from "@/components/OrbitingLoader";
import Sidebar from "@/components/Sidebar";
import DeleteForm from "@/components/forms/classe-delete-form";
import EditForm from "@/components/forms/classe-edit-form";
import IconMenu from "@/components/icon-menu";
import Navbar from "@/components/navbar";
import { ResponsiveDialog } from "@/components/responsive-dialog";
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
import { type Classe, type User } from "@/types";
import { getActualUser } from "@/utils/function";
import Cookies from "js-cookie";
import { MoreVertical, SquarePen, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../../assets/css/fonts.css";

function Item({
  classe,
  getClasses: getClasses,
  onClick,
}: {
  classe: Classe;
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
        title={`Modification de la Classe: ${classe.nomClasse}`}
      >
        <EditForm
          props={classe}
          setIsOpen={setIsEditOpen}
          onSuccess={getClasses}
        />
      </ResponsiveDialog>
      <ResponsiveDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title={`Suppression de la Classe: ${classe.nomClasse}`}
        description={`Êtes-vous sûr de vouloir supprimer la filière "${classe.nomClasse}" ?`}
      >
        <DeleteForm
          props={classe}
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
              {classe.nomClasse === "" ? "Aucune Classe" : classe.nomClasse}
            </CardTitle>
            <CardDescription>
              Nombre de Matiere: {classe.classeMatiere}
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

export default function ListeClasseFiliere() {
  const { filiereName } = useParams<{ filiereName?: string }>();
  const userCookie = Cookies.get("user");
  const [actualUser, setActualUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [classes, setClasses] = useState<Classe[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const classesPerPage = 6;

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
    if (userCookie) {
      getActualUser(userCookie, setActualUser, toast, navigate);
    }
    getClasses();
  }, []);
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
        <div className="flex h-full">
          <Sidebar />
          <div className="flex flex-col w-full">
            <Navbar />
            <div className="flex-1 flex flex-col justify-center items-center pr-9 pl-9 bg-slate-100 dark:bg-slate-950">
              <div className="w-full grid grid-cols-1 sm:grid-cols-4 gap-4">
                {currentClasses.map((classe) => (
                  <Item
                    key={classe.id_classe}
                    classe={classe}
                    onClick={() => handleCardClick(classe.nomClasse)}
                    getClasses={getClasses}
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
