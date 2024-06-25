"use client";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import EditForm from "@/components/forms/filiere-edit-form";
import IconMenu from "@/components/icon-menu";
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
import { MoreVertical, SquarePen, Trash2 } from "lucide-react";
import OrbitingLoader from "@/components/OrbitingLoader";
import Navbar from "@/components/navbar";
import { useToast } from "@/components/ui/use-toast";
import Cookies from "js-cookie";
import "../../../assets/css/fonts.css";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";

type Person = {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
};

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

function Item({
  filiere,
  getFilieres,
}: {
  filiere: Filiere;
  getFilieres: () => void;
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleEditClick = (event: React.MouseEvent) => {
    event.preventDefault(); // Prevents DropdownMenu.Content from closing
    setIsEditOpen(true);
  };

  return (
    <>
      <ResponsiveDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title="Edit Filiere"
      >
        <EditForm
          props={filiere}
          setIsOpen={setIsEditOpen}
          onSuccess={getFilieres}
        />
      </ResponsiveDialog>
      <Card
        className="drop-shadow-xl shadow-black/10 bg-white dark:shadow-primary dark:bg-slate-900 relative hover:shadow-xl duration-200 transition-all cursor-pointer"
        style={{ width: "200px" }}
      >
        <CardHeader className="flex flex-row gap-4 items-center pb-2">
          <div className="flex flex-col">
            <CardTitle className="text-base">
              {filiere.nomFiliere === ""
                ? "Aucune filiere"
                : filiere.nomFiliere}
            </CardTitle>
            <CardDescription>
              Nombre de Classe: {filiere.nombreClasse}
            </CardDescription>
          </div>
        </CardHeader>

        <div className="absolute right-4 top-4 z-10">
          <span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
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
                    onClick={() => setIsDeleteOpen(true)}
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
      </Card>
    </>
  );
}

export default function CardPage() {
  const userCookie = Cookies.get("user");
  const [actualUser, setActualUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [filiers, setFilieres] = useState<Filiere[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const filieresPerPage = 6;

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
                {currentFilieres.map((filiere) => (
                  <Item
                    key={filiere.id_filiere}
                    filiere={filiere}
                    getFilieres={getFilieres}
                  />
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
