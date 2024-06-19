/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Card,
  List,
  ListItem,
  ListItemPrefix,
  Typography,
} from "@material-tailwind/react";
import Cookies from "js-cookie";
import { AlignJustify, Book, BookOpenText, CirclePlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MiniProfil from "./MiniProfil";

export default function Sidebar() {
  const navigate = useNavigate();
  type User = {
    id_user: string;
    nom: string;
    prenom: string;
    email: string;
    niveauAccess: string;
  };
  const [actualUser, setActualUser] = useState<User | null>(null);
  const userCookie = Cookies.get("user");

  const getActualUser = async () => {
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
  };

  useEffect(() => {
    getActualUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCookie]);

  const [open, setOpen] = React.useState(0);
  const [open2, setOpen2] = React.useState(0);

  const handleOpen = (value: number) => {
    setOpen(open === value ? 0 : value);
    setOpen2(0);
  };

  const handleOpen2 = (value: number) => {
    setOpen2(open2 === value ? 0 : value);
  };

  return (
    <Card className="h-[calc(97.5vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 dark:bg-slate-900 dark:text-white mt-14">
      <div className="w-full bg-slate-900">
        <MiniProfil
          nom={actualUser?.nom || ""}
          prenom={actualUser?.prenom || ""}
          email={actualUser?.email || ""}
        />
      </div>
      <List className="mt-24">
        <Accordion
          open={open === 1}
          icon={
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${
                open === 1 ? "rotate-180" : ""
              }`}
            />
          }
        >
          <ListItem
            className="p-0 hover:bg-primary focus:text-primary dark:focus:bg-slate-900 focus:bg-white"
            selected={open === 1}
          >
            <AccordionHeader
              onClick={() => handleOpen(1)}
              className="p-3 border-b-0 hover:bg-primary focus:text-primary dark:focus:bg-slate-900 focus:bg-white"
            >
              <ListItemPrefix>
                {open === 1 ? (
                  <BookOpenText className="w-5 h-5" />
                ) : (
                  <Book className="w-5 h-5" />
                )}
              </ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto font-normal">
                Filiere
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              <Link to={"/ListeFiliere"}>
                <ListItem className="hover:bg-primary focus:text-primary dark:focus:bg-slate-900 focus:bg-white">
                  <ListItemPrefix>
                    <AlignJustify strokeWidth={3} className="w-5 h-3" />
                  </ListItemPrefix>
                  Liste Filiere
                </ListItem>
              </Link>
              {actualUser?.niveauAccess === "ADMIN" ? (
                <Link to={"/AjoutFiliere"}>
                  <ListItem className="hover:bg-primary focus:text-primary dark:focus:bg-slate-900 focus:bg-white">
                    <ListItemPrefix>
                      <CirclePlus strokeWidth={3} className="w-5 h-3" />
                    </ListItemPrefix>
                    Ajout Filiere
                  </ListItem>
                </Link>
              ) : null}
            </List>
          </AccordionBody>
        </Accordion>
        <Accordion
          open={open === 2}
          icon={
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${
                open === 2 ? "rotate-180" : ""
              }`}
            />
          }
        >
          <ListItem
            className="p-0 hover:bg-primary focus:text-primary dark:focus:bg-slate-900 focus:bg-white"
            selected={open === 2}
          >
            <AccordionHeader
              onClick={() => handleOpen(2)}
              className="p-3 border-b-0 hover:bg-primary focus:text-primary dark:focus:bg-slate-900 focus:bg-white"
            >
              <ListItemPrefix>
                {open === 2 ? (
                  <BookOpenText className="w-5 h-5" />
                ) : (
                  <Book className="w-5 h-5" />
                )}
              </ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto font-normal">
                Classe
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              <Link to={"/ListeClasse"}>
                <ListItem className="hover:bg-primary focus:text-primary dark:focus:bg-slate-900 focus:bg-white">
                  <ListItemPrefix>
                    <AlignJustify strokeWidth={3} className="w-5 h-3" />
                  </ListItemPrefix>
                  Liste Classe
                </ListItem>
              </Link>
              {actualUser?.niveauAccess === "ADMIN" ? (
                <Link to={"/AjoutClasse"}>
                  <ListItem className="hover:bg-primary focus:text-primary dark:focus:bg-slate-900 focus:bg-white">
                    <ListItemPrefix>
                      <CirclePlus strokeWidth={3} className="w-5 h-3" />
                    </ListItemPrefix>
                    Ajout Classe
                  </ListItem>
                </Link>
              ) : null}
            </List>
          </AccordionBody>
        </Accordion>
        <Accordion
          open={open === 3}
          icon={
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${
                open === 3 ? "rotate-180" : ""
              }`}
            />
          }
        >
          <ListItem
            className="p-0 hover:bg-primary focus:text-primary dark:focus:bg-slate-900 focus:bg-white"
            selected={open === 3}
          >
            <AccordionHeader
              onClick={() => handleOpen(3)}
              className="p-3 border-b-0 hover:bg-primary focus:text-primary dark:focus:bg-slate-900 focus:bg-white"
            >
              <ListItemPrefix>
                {open === 3 ? (
                  <BookOpenText className="w-5 h-5" />
                ) : (
                  <Book className="w-5 h-5" />
                )}
              </ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto font-normal">
                Matiere
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              <Link to={"/ListeMatiere"}>
                <ListItem className="hover:bg-primary focus:text-primary dark:focus:bg-slate-900 focus:bg-white">
                  <ListItemPrefix>
                    <AlignJustify strokeWidth={3} className="w-5 h-3" />
                  </ListItemPrefix>
                  Liste Matiere
                </ListItem>
              </Link>
              {actualUser?.niveauAccess === "ADMIN" ? (
                <Link to={"/AjoutMatiere"}>
                  <ListItem className="hover:bg-primary focus:text-primary dark:focus:bg-slate-900 focus:bg-white">
                    <ListItemPrefix>
                      <CirclePlus strokeWidth={3} className="w-5 h-3" />
                    </ListItemPrefix>
                    Ajout Matiere
                  </ListItem>
                </Link>
              ) : null}
            </List>
          </AccordionBody>
        </Accordion>
        <Accordion
          open={open === 4}
          icon={
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${
                open === 4 ? "rotate-180" : ""
              }`}
            />
          }
        >
          <ListItem
            className="p-0 hover:bg-primary focus:text-primary dark:focus:bg-slate-900 focus:bg-white"
            selected={open === 4}
          >
            <AccordionHeader
              onClick={() => handleOpen(4)}
              className="p-3 border-b-0 hover:bg-primary focus:text-primary dark:focus:bg-slate-900 focus:bg-white"
            >
              <ListItemPrefix>
                {open === 4 ? (
                  <BookOpenText className="w-5 h-5" />
                ) : (
                  <Book className="w-5 h-5" />
                )}
              </ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto font-normal">
                Cours
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              <ListItem className="hover:bg-primary focus:text-primary dark:focus:bg-slate-900 focus:bg-white">
                <Accordion
                  open={open2 === 1}
                  icon={
                    <ChevronDownIcon
                      strokeWidth={2.5}
                      className={`mx-auto h-4 w-4 transition-transform ${
                        open2 === 1 ? "rotate-180" : ""
                      }`}
                    />
                  }
                >
                  <ListItem
                    className="p-0 hover:bg-primary focus:text-primary dark:focus:bg-slate-900 focus:bg-white"
                    selected={open2 === 1}
                  >
                    <AccordionHeader
                      onClick={() => handleOpen2(1)}
                      className="p-3 border-b-0 hover:bg-primary focus:text-primary dark:focus:bg-slate-900 focus:bg-white"
                    >
                      <ListItemPrefix>
                        {open2 === 1 ? (
                          <BookOpenText className="w-5 h-5" />
                        ) : (
                          <Book className="w-5 h-5" />
                        )}
                      </ListItemPrefix>
                      <Typography
                        color="blue-gray"
                        className="mr-auto font-normal"
                      >
                        Lecon
                      </Typography>
                    </AccordionHeader>
                  </ListItem>
                  <AccordionBody className="py-1">
                    <List className="p-0">
                      <Link to={"/ListeLecon"}>
                        <ListItem className="hover:bg-primary focus:text-primary dark:focus:bg-slate-900 focus:bg-white">
                          <ListItemPrefix>
                            <AlignJustify strokeWidth={3} className="w-5 h-3" />
                          </ListItemPrefix>
                          Liste Lecon
                        </ListItem>
                      </Link>
                      {actualUser?.niveauAccess === "ADMIN" ||
                      actualUser?.niveauAccess === "ENSEIGNANT" ? (
                        <Link to={"/AjoutLecon"}>
                          <ListItem className="hover:bg-primary focus:text-primary dark:focus:bg-slate-900 focus:bg-white">
                            <ListItemPrefix>
                              <CirclePlus strokeWidth={3} className="w-5 h-3" />
                            </ListItemPrefix>
                            Ajout Lecon
                          </ListItem>
                        </Link>
                      ) : null}
                    </List>
                  </AccordionBody>
                </Accordion>
              </ListItem>
              <ListItem className="hover:bg-primary focus:text-primary dark:focus:bg-slate-900 focus:bg-white">
                <Accordion
                  open={open2 === 2}
                  icon={
                    <ChevronDownIcon
                      strokeWidth={2.5}
                      className={`mx-auto h-4 w-4 transition-transform ${
                        open2 === 2 ? "rotate-180" : ""
                      }`}
                    />
                  }
                >
                  <ListItem
                    className="p-0 hover:bg-primary focus:text-primary dark:focus:bg-slate-900 focus:bg-white"
                    selected={open2 === 2}
                  >
                    <AccordionHeader
                      onClick={() => handleOpen2(2)}
                      className="p-3 border-b-0 hover:bg-primary focus:text-primary dark:focus:bg-slate-900 focus:bg-white"
                    >
                      <ListItemPrefix>
                        {open2 === 2 ? (
                          <BookOpenText className="w-5 h-5" />
                        ) : (
                          <Book className="w-5 h-5" />
                        )}
                      </ListItemPrefix>
                      <Typography
                        color="blue-gray"
                        className="mr-auto font-normal"
                      >
                        Evaluation
                      </Typography>
                    </AccordionHeader>
                  </ListItem>
                  <AccordionBody className="py-1">
                    <List className="p-0">
                      <Link to={"/ListeEvaluation"}>
                        <ListItem className="hover:bg-primary focus:text-primary dark:focus:bg-slate-900 focus:bg-white">
                          <ListItemPrefix>
                            <AlignJustify strokeWidth={3} className="w-5 h-3" />
                          </ListItemPrefix>
                          Liste Evaluation
                        </ListItem>
                      </Link>
                      {actualUser?.niveauAccess === "ADMIN" ||
                      actualUser?.niveauAccess === "ENSEIGNANT" ? (
                        <Link to={"/AjoutEvaluation"}>
                          <ListItem className="hover:bg-primary focus:text-primary dark:focus:bg-slate-900 focus:bg-white">
                            <ListItemPrefix>
                              <CirclePlus strokeWidth={3} className="w-5 h-3" />
                            </ListItemPrefix>
                            Ajout Evaluation
                          </ListItem>
                        </Link>
                      ) : null}
                    </List>
                  </AccordionBody>
                </Accordion>
              </ListItem>
            </List>
          </AccordionBody>
        </Accordion>
        {actualUser?.niveauAccess === "ADMIN" ? (
          <Link to={"/ListeUser"}>
            <ListItem className="hover:bg-primary focus:text-primary dark:focus:bg-slate-900 focus:bg-white">
              <ListItemPrefix>
                <UserCircleIcon className="w-5 h-5" />
              </ListItemPrefix>
              Liste des utilisateur
            </ListItem>
          </Link>
        ) : null}
      </List>
    </Card>
  );
}
