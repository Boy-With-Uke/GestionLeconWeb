/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import DeleteForm from "@/components/forms/filiere-delete-form";
import EditForm from "@/components/forms/filiere-edit-form";
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
import { type Filiere, type User } from "@/types";
import { getActualUser } from "@/utils/function";
import Cookies from "js-cookie";
import { MoreVertical, SquarePen, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../assets/css/fonts.css";
import { Input } from "@/components/ui/input";

function Item({
  filiere,
  getFilieres,
  onClick,
}: {
  filiere: Filiere;
  getFilieres: () => void;
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
        title={`Modification de la Filière: ${filiere.nomFiliere}`}
      >
        <EditForm
          props={filiere}
          setIsOpen={setIsEditOpen}
          onSuccess={getFilieres}
        />
      </ResponsiveDialog>
      <ResponsiveDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title={`Suppression de la Filière: ${filiere.nomFiliere}`}
        description={`Êtes-vous sûr de vouloir supprimer la filière "${filiere.nomFiliere}" ?`}
      >
        <DeleteForm
          props={filiere}
          onSuccess={getFilieres}
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
              {filiere.nomFiliere === ""
                ? "Aucune filière"
                : filiere.nomFiliere}
            </CardTitle>
            <CardDescription>
              Nombre de Classe: {filiere.nombreClasse}
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

export default function ListeFiliere() {
  const userCookie = Cookies.get("user");
  const [actualUser, setActualUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [filiers, setFilieres] = useState<Filiere[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const filieresPerPage = 6;

  const startIndex = (currentPage - 1) * filieresPerPage;
  const endIndex = startIndex + filieresPerPage;

  const filteredFilieres = filiers.filter((filiere) =>
    filiere.nomFiliere.toLowerCase().includes(searchText.toLowerCase())
  );

  const currentFilieres = filteredFilieres.slice(startIndex, endIndex);

  // Change page
  const paginate = (pageNumber: number) => {
    if (
      pageNumber >= 1 &&
      pageNumber <= Math.ceil(filteredFilieres.length / filieresPerPage)
    ) {
      setCurrentPage(pageNumber);
    }
  };

  const getFilieres = async () => {
    try {
      const req = await fetch(`http://localhost:5173/api/filiere`);
      const data = await req.json();
      const filieres: Filiere[] = data.filieres.map((filiere: any) => ({
        id_filiere: filiere.id_filiere,
        nomFiliere: filiere.nomFiliere,
        nombreClasse: filiere.classes.length,
      }));
      setFilieres(filieres);

      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error fetching filieres data:", error);
    }
  };

  useEffect(() => {
    // Fetch user data
    if (userCookie) {
      getActualUser(userCookie, setActualUser, toast, navigate);
    }
    getFilieres();
  }, []);

  const handleCardClick = (filiereName: string) => {
    navigate(`/ListeClasseFiliere/${filiereName}`);
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
              <div className="flex w-full justify-center items-center py-4 pb-9">
                <Input
                  placeholder="Filtrer les noms..."
                  className="max-w-sm"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
              <div className="w-full grid grid-cols-1 sm:grid-cols-4 gap-4">
                {currentFilieres.map((filiere) => (
                  <Item
                    key={filiere.id_filiere}
                    filiere={filiere}
                    onClick={() => handleCardClick(filiere.nomFiliere)}
                    getFilieres={getFilieres}
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
                        filteredFilieres.length / filieresPerPage
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
