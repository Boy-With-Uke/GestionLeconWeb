import { Footer } from "@/components/Footer";
import OrbitingLoader from "@/components/OrbitingLoader";
import Navbar from "@/components/navbar";
import { CardContainer, CardItem } from "@/components/ui/3d-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/fonts.css";
export default function Profil() {
  type User = {
    id_user: string;
    nom: string;
    prenom: string;
    email: string;
    niveauAccess: string;
  };

  const [actualUser, setActualUser] = useState<User | null>(null);
  const userCookie = Cookies.get("user");
  const [isLoading, setIsLoading] = useState(true);
  const [userFiliere, setUserFiliere] = useState("");
  const [userClasse, setUserClasse] = useState("");
  const [favorisCount, setFavorisCount] = useState(0);
  const [status, setStatus] = useState("");

  const navigate = useNavigate();
  // 1. Define your form
  const getActualUser = async () => {
    if (!userCookie) {
      console.log("No user cookie found.");
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
        console.log("User data fetched:", data.user);
        const user: User = data.user;
        setActualUser(user);
        setUserClasse(data.user.classe.nomClasse);
        setUserFiliere(data.user.classe.classeFiliere.nomFiliere);
        setFavorisCount(data.coursCount);
        const statusU = data.user.niveauAccess;
        const status = statusU.toLowerCase()
        const statusToUper = status.charAt(0).toUpperCase() + status.slice(1);
        setStatus(statusToUper);
        console.log(statusToUper)
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  useEffect(() => {
    // Show the loader for at least 3 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Fetch user data
    getActualUser();

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
        <>
          <Navbar />
          <div className="flex justify-center items-center min-h-screen bg-slate-100 dark:bg-slate-950">
            <CardContainer>
              <Card className="flex top-4 flex-col justify-center items-center bg-white shadow-xl w-l shadow-black/10 dark:shadow-primary dark:bg-slate-900">
                <CardItem translateZ="100" className="mt-4 w-full">
                  <CardHeader className="flex justify-center items-center pb-2 mt-8">
                    <img
                      src={`https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${actualUser?.email}${actualUser?.nom}`}
                      alt="user avatar"
                      className="absolute grayscale-[0%] -top-12 rounded-full w-24 h-24 aspect-square object-cover"
                    />
                    <CardTitle className="text-center">{`${actualUser?.nom} ${actualUser?.prenom}`}</CardTitle>
                    <CardDescription className="font-normal text-primary">
                      {actualUser?.email}
                    </CardDescription>
                  </CardHeader>
                </CardItem>

                <CardContent className="flex flex-row gap-x-12 items-center text-center">
                  <div className="flex flex-col text-center">
                    <p
                      className="text-3xl text-center"
                      style={{ fontFamily: "Asquire" }}
                    >
                      Filiere:
                    </p>
                    <p className="mt-8 text-2xl font-bold text-center text-primary">
                      {userFiliere}
                    </p>
                  </div>
                  <div className="flex flex-col text-center">
                    <p
                      className="text-3xl text-center"
                      style={{ fontFamily: "Asquire" }}
                    >
                      Classe:
                    </p>
                    <p className="mt-8 text-2xl font-bold text-center text-primary">
                      {userClasse}
                    </p>
                  </div>
                  <div className="flex flex-col text-center">
                    <p
                      className="text-3xl text-center"
                      style={{ fontFamily: "Asquire" }}
                    >
                      Favoris:
                    </p>
                    <p className="mt-8 text-2xl font-bold text-center text-primary">
                      {favorisCount}
                    </p>
                  </div>
                  <div className="flex flex-col text-center">
                    <p
                      className="text-3xl text-center"
                      style={{ fontFamily: "Asquire" }}
                    >
                      Status:
                    </p>
                    <p className="mt-8 text-2xl font-bold text-center text-primary">
                      {status}
                    </p>
                  </div>
                </CardContent>

                <CardFooter>
                  <button
                    onClick={() => {
                      Cookies.remove("user");
                      navigate("/");
                    }}
                    type="button"
                    className="px-4 py-2 font-bold text-white rounded-full bg-primary"
                  >
                    Déconnexion
                  </button>
                </CardFooter>
              </Card>
            </CardContainer>
          </div>

          <Footer />
        </>
      )}
    </>
  );
}
