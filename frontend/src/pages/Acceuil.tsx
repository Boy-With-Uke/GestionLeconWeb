import { About } from "@/components/About";
import { Foire } from "@/components/FAQ";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import OrbitingLoader from "@/components/OrbitingLoader";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Services } from "@/components/Services";
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
  const [isLoading, setIsLoading] = useState(true);

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
          <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
            <Navbar />
            <Hero />
            <About />
            <HowItWorks />
            <Features />
            <Services />
            <Foire />
            <Footer />
            <ScrollToTop />
          </div>
        </>
      )}
    </>
  );
}
