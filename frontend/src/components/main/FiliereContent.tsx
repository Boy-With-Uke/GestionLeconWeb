import "@/assets/css/fonts.css";
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
import {
  Button,
  DialogFooter,
  DialogHeader,
  Input,
} from "@material-tailwind/react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  Label,
} from "@radix-ui/react-context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FiliereContent() {
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
  const [filieres, setFilieres] = useState<Filiere[]>([]);
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
  const currentFilieres = filieres.slice(startIndex, endIndex);

  // Change page
  const paginate = (pageNumber: number) => {
    if (
      pageNumber >= 1 &&
      pageNumber <= Math.ceil(filieres.length / filieresPerPage)
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
      const data = await req.json();
      if (req.status === 200) {
        toast({
          title: `Success`,
          description: data.message || `Suppression réussie`,
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
      console.error("Error deleting filiere:", error);
    }
  };

  const handleEditClick = (filiere: Filiere) => {
    setActualFiliere(filiere);
    setIsEditDialogOpen(true);
  };

  return (
    <>
      {currentFilieres.map((filiere) => (
        <div className="context-menu-container" key={filiere.id_filiere}>
          <div className="w-full">
            <ContextMenu>
              <ContextMenuTrigger>
                <Card
                  onClick={() => handleCardClick(filiere.nomFiliere)}
                  className="drop-shadow-xl shadow-black/10 bg-white dark:shadow-primary dark:bg-slate-900 cursor-pointer"
                  style={{ width: "200px" }}
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
              </ContextMenuTrigger>
              {actualUser?.niveauAccess === "ADMIN" ? (
                <>
                  <ContextMenuContent className="context-menu-content w-64 dark:bg-slate-900 border-2 border-primary">
                    <ContextMenuItem
                      onClick={() => handleDelete(filiere.id_filiere)}
                      className="cursor-pointer hover:bg-primary focus:text-primary dark:focus:bg-slate-900 focus:bg-white"
                    >
                      Supprimer
                    </ContextMenuItem>
                    <ContextMenuItem
                      onClick={() => handleEditClick(filiere)}
                      className="hover:bg-primary cursor-pointer focus:text-primary dark:focus:bg-slate-900 focus:bg-white"
                    >
                      Modifier
                    </ContextMenuItem>
                  </ContextMenuContent>
                </>
              ) : null}
            </ContextMenu>
          </div>
        </div>
      ))}

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => paginate(currentPage - 1)} />
          </PaginationItem>
          {Array.from(
            { length: Math.ceil(filieres.length / filieresPerPage) },
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

      {/* Dialog outside main structure */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Nom</Label>
              <Input
                id="name"
                value={actualFiliere?.nomFiliere}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Prenom</Label>
              <Input id="username" value="@peduarte" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsEditDialogOpen(false)}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
