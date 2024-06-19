/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { CircleUserRound } from "lucide-react";
import { SVGProps, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavContent from "./NavContent";
import { ModeToggle } from "./mode-toogle";

export default function Navbar() {
  type User = {
    id_user: string;
    nom: string;
    prenom: string;
    email: string;
    niveauAccess: string;
  };

  const [actualUser, setActualUser] = useState<User | null>(null);
  const userCookie = Cookies.get("user");
  const navigate = useNavigate();

  const getActualUser = async () => {
    if (!userCookie) {
      console.log("No user cookie found.");
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
    // Fetch user data
    getActualUser();
  }, []);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm dark:bg-slate-900">
      
      <div className="px-4 mx-auto w-full max-w-7xl">
        <div className="flex justify-between items-center h-14">
          <Link to="/" className="flex items-center">
            <MountainIcon className="w-6 h-6" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          <nav className="hidden gap-4 md:flex">
            <NavContent />
          </nav>
          <div className="flex gap-4 items-center">
            {userCookie ? (
              <>
                <Link to="/Profil">
                  <CircleUserRound className="text-primary" />
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-primary hover:bg-primary hover:text-white"
                  onClick={() => {
                    Cookies.remove("user");
                    navigate("/Connexion");
                  }}
                >
                  Deconnexion
                </Button>
              </>
            ) : (
              <>
                <Link to={"/Connexion"}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-primary hover:bg-primary hover:text-white"
                  >
                    Connexion
                  </Button>
                </Link>
                <Link to={"/Inscription"}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-primary hover:bg-primary hover:text-white"
                  >
                    Inscription
                  </Button>
                </Link>
              </>
            )}
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
function MountainIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="dark:text-primary"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
