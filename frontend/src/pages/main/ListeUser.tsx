import OrbitingLoader from "@/components/main/OrbitingLoader";
import Sidebar from "@/components/main/Sidebar";
import UserTableContent from "@/components/main/UserTableContent";
import Navbar from "@/components/main/navbar";
import { useToast } from "@/components/ui/use-toast";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const ListeUser = () => {
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
  const { toast } = useToast();
  const navigate = useNavigate();
  // 1. Define your form
  const getActualUser = async () => {
    if (!userCookie) {
      toast({
        variant: "destructive",
        title: `Erreur`,
        description: "Vous devez vous connecter pour acceder a cette ressource",
      });
      navigate("/");
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
        console.log(actualUser);
        if (data.user.niveauAccess !== "ADMIN") {
          toast({
            variant: "destructive",
            title: `Erreur`,
            description: ` Ressources indisponibles pour votre niveau d'acces`,
          });
          navigate("/");
        }
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
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex flex-col w-full">
            <Navbar />
            <div className="flex-1 flex justify-center items-center pr-9 pl-9 bg-slate-100 dark:bg-slate-950">
              <UserTableContent />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
