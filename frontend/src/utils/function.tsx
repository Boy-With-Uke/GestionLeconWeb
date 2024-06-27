import { type User } from "@/types";

type ToastFunction = (options: {
  variant: "default" | "destructive" | null | undefined;
  title: string;
  description: string;
}) => void;

type NavigateFunction = (path: string) => void;

export const getActualUser = async (
  userCookie: string | null,
  setActualUser: (user: User | null) => void,
  toast: ToastFunction,
  navigate: NavigateFunction
) => {
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
