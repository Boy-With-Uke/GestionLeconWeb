import Navbar from "@/components/navbar";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function Acceuil() {
  type User = {
    id_user: string;
    nom: string;
    prenom: string;
    email: string;
    niveauAccess: string;
  };

  const userCookie = Cookies.get("user");
  const [actualUser, setActualUser] = useState<User | null>(null);

  console.log("User cookie:", userCookie);

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
        console.log("User data fetched:", data.user);
        const user: User = data.user;
        setActualUser(user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  useEffect(() => {
    getActualUser();
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ marginTop: "50px" }}>
        <p>essaie</p>
        <p className="text-black">{actualUser?.nom}</p>
      </div>
    </>
  );
}
