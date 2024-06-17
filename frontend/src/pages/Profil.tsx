import Navbar from "@/components/navbar";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import OrbitingLoader from "@/components/OrbitingLoader";
import { useEffect, useState } from "react";
import { Footer } from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
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
          <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950">
            <Card className=" top-4 w-l flex flex-col justify-center items-center drop-shadow-xl  shadow-black/10 bg-white dark:shadow-primary dark:bg-slate-900">
              <CardHeader className="mt-8 flex justify-center items-center pb-2">
                <img
                  src={`https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${actualUser?.email}`}
                  alt="user avatar"
                  className="absolute grayscale-[0%] -top-12 rounded-full w-24 h-24 aspect-square object-cover"
                />
                <CardTitle className="text-center">{`${actualUser?.nom} ${actualUser?.prenom}`}</CardTitle>
                <CardDescription className="font-normal text-primary">
                  {actualUser?.email}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-row gap-x-28 items-center text-center">
                <div className="flex flex-col text-center">
                  <p className="text-3xl" style={{ fontFamily: "Asquire" }}>
                    Filiere:
                  </p>
                  <p className="mt-8 text-2xl font-bold text-primary">
                    {userFiliere}
                  </p>
                </div>
                <div className="flex flex-col text-center">
                  <p className="text-3xl" style={{ fontFamily: "Asquire" }}>
                    Classe:
                  </p>
                  <p className="mt-8 text-2xl font-bold text-primary">
                    {userClasse}
                  </p>
                </div>
                <div className="flex flex-col text-center">
                  <p className="text-3xl" style={{ fontFamily: "Asquire" }}>
                    Favoris:
                  </p>
                  <p className="mt-8 text-2xl font-bold text-primary">
                    {favorisCount}
                  </p>
                </div>
              </CardContent>

              <CardFooter></CardFooter>
            </Card>
          </div>

          <Footer />
        </>
      )}
    </>
  );
}
