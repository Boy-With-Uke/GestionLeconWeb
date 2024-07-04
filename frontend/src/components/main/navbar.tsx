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
        
            <span className="ml-2">E-Hianatra</span>
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
      fill="#21C45D"
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 369.408 369.408"
      stroke="#6C27D9"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <g>
          {" "}
          <g>
            {" "}
            <g>
              {" "}
              <path d="M337.643,206.989c8.711,0,15.772-7.063,15.772-15.771c0-8.711-7.063-15.772-15.772-15.772H65.849 c-27.492,0-49.858,22.366-49.858,49.86v56.576c0,17.762,9.584,49.859,49.797,49.859c30.287,0,271.854,0,271.854,0 c8.711,0,15.772-7.062,15.772-15.771c0-8.709-7.063-15.771-15.772-15.771h-4.41v-93.207L337.643,206.989L337.643,206.989z M301.688,237.821H199.885c-8.709,0-15.771,7.061-15.771,15.771c0,8.709,7.062,15.771,15.771,15.771h101.805v30.832H65.849 c-10.099,0-18.315-8.219-18.315-18.314v-56.575c0-10.101,8.217-18.315,18.315-18.315h235.838V237.821L301.688,237.821z"></path>{" "}
              <path d="M353.302,45.953c-4.364-0.535-67.923-8.286-82.5-8.286c-4.153,0-8.261,0.146-12.188,0.432 c-12.204,0.812-24.714,3.612-36.812,6.322c-13.332,2.985-25.926,5.806-37.1,5.806c-11.025,0-23.184-2.747-36.056-5.655 c-12.196-2.756-24.808-5.605-37.794-6.469c-3.975-0.289-8.096-0.436-12.248-0.436c-14.576,0-78.135,7.751-82.501,8.286 C7.209,46.039,0,53.302,0,62.217V76.11c0,8.969,7.296,16.265,16.264,16.265h9.807c4.275,32.48,22.649,55.041,49.474,60.556 c5.152,1.058,10.375,1.594,15.523,1.594c15.202,0,29.892-4.633,42.484-13.397c12.33-8.585,22.101-20.745,28.256-35.166 c0.455-1.067,0.872-2.11,1.276-3.16c0.258-0.679,6.478-16.62,21.619-16.62c15.141,0,21.361,15.941,21.626,16.636 c0.396,1.032,0.812,2.077,1.271,3.145c6.154,14.422,15.927,26.582,28.257,35.166c12.591,8.765,27.28,13.397,42.483,13.397 c5.148,0,10.371-0.536,15.522-1.594c26.822-5.514,45.197-28.075,49.475-60.556h9.808c8.968,0,16.264-7.296,16.264-16.265V62.218 C369.406,53.302,362.196,46.039,353.302,45.953z M143.915,98.324c-9.673,22.666-29.923,36.747-52.849,36.747 c-3.842,0-7.746-0.402-11.606-1.197c-28.229-5.802-33.602-36.032-34.602-48.76c-0.469-5.987,1.04-10.776,4.614-14.642 c7.846-8.486,25.754-13.354,49.133-13.354c3.68,0,7.341,0.13,10.896,0.388c15.786,1.05,26.372,4.256,33.314,10.088 C145.404,69.768,153.28,76.383,143.915,98.324z M324.548,85.114c-1,12.728-6.373,42.958-34.603,48.761 c-3.859,0.794-7.766,1.196-11.605,1.196c-22.925,0-43.176-14.081-52.849-36.747c-9.365-21.944-1.489-28.556,1.101-30.729 c6.941-5.832,17.542-9.039,33.372-10.092c3.509-0.255,7.156-0.384,10.838-0.384c23.379,0,41.286,4.867,49.133,13.354 C323.508,74.338,325.018,79.127,324.548,85.114z"></path>{" "}
            </g>{" "}
          </g>{" "}
        </g>{" "}
      </g>
    </svg>
  );
}
