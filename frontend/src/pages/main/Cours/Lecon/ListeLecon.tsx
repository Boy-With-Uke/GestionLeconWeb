/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import DeleteForm from "@/components/forms/cours-delete-form";
import EditForm from "@/components/forms/cours-edit-form";
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
import { type Lesson, type User } from "@/types";
import { getActualUser } from "@/utils/function";
import Cookies from "js-cookie";
import { MoreVertical, SquarePen, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "@/assets/css/fonts.css";
import { Input } from "@/components/ui/input";

function Item({
  lesson,
  getClasses: getClasses,
  onClick,
}: {
  lesson: Lesson;
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
        title={`Modification de la Lecon: ${lesson.titre}`}
      >
        <EditForm
          props={lesson}
          setIsOpen={setIsEditOpen}
          onSuccess={getClasses}
        />
      </ResponsiveDialog>
      <ResponsiveDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title={`Suppression du cours: ${lesson.titre}`}
        description={`Êtes-vous sûr de vouloir supprimer du cours "${lesson.titre}" ?`}
      >
        <DeleteForm
          props={lesson}
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
              {lesson.titre === "" ? "Aucune Classe" : lesson.titre}
            </CardTitle>
            <CardDescription className="text-center flex flex-row">
              Type de cours: {lesson.typeLecon}
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

export default function ListeLecon() {
  const { subjectName: subjectName } = useParams<{ subjectName?: string }>();
  const userCookie = Cookies.get("user");
  const [actualUser, setActualUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;

  const startIndex = (currentPage - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;

  // Get current filieres

  // Change page
  const paginate = (pageNumber: number) => {
    if (
      pageNumber >= 1 &&
      pageNumber <= Math.ceil(lessons.length / coursesPerPage)
    ) {
      setCurrentPage(pageNumber);
    }
  };

  const getCours = async () => {
    try {
      const req = await fetch(`http://localhost:5173/api/lesson`);
      const data = await req.json();
      console.log(data); // Vérifiez la structure des données ici

      let lessons: Lesson[] = data.lessons.map((lesson: any) => {
        return {
          id_lecon: lesson.id_lecon,
          titre: lesson.titre,
          contenue: lesson.contenue,
          typeLecon: lesson.typeLecon,
          matiereLesson: lesson.matiereLesson.map((ml: any) => ({
            matiere: {
              id_matiere: ml.matiere.id_matiere,
              nom: ml.matiere.nom,
              description: ml.matiere.description,
              enseignant: ml.matiere.enseignant,
              lecon: ml.matiere.lecon,
              classeMatiere: ml.matiere.classeMatiere,
            },
          })),
        };
      });

      if (subjectName) {
        lessons = lessons.filter((lesson) =>
          lesson.matiereLesson.some((ml) => ml.matiere.nom === subjectName)
        );
      }

      setLessons(lessons.filter((lesson) => lesson.typeLecon === "LESSON"));
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
    getCours();
  }, []);
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
                        getClasses={getCours}
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
                            filteredCourses.length / coursesPerPage
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
