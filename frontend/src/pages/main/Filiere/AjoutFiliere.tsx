"use client";
import OrbitingLoader from "@/components/main/OrbitingLoader";
import Sidebar from "@/components/main/Sidebar";
import Navbar from "@/components/main/navbar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { type User } from "@/types";
import { getActualUser } from "@/utils/function";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  nomFiliere: z.string().min(5, {
    message: "Le nom de la filiere doit etre au minimum 5 caracteres",
  }),
});
export default function AjoutFiliere() {
  const [actualUser, setActualUser] = useState<User | null>(null);
  const userCookie = Cookies.get("user");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomFiliere: "",
    },
  });
  // 1. Define your form
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const req = await fetch(`http://localhost:5173/api/filiere`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nomFiliere: values.nomFiliere,
        }),
      });

      const data = await req.json();

      if (req.status === 401) {
        toast({
          variant: "destructive",
          title: `Erreur`,
          description: data.message || "Filiere deja existante",
        });
      } else if (req.status === 200) {
        toast({
          title: `Success`,
          description: data.message || " Nouvelle filiere créé avec succès",
        });
      } else {
        toast({
          variant: "destructive",
          title: `Erreur`,
          description: data.message || "Une erreur est survenue",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      toast({
        variant: "destructive",
        title: `Erreur`,
        description:
          "Une erreur est survenue lors de la tentative de connexion.",
      });
    }
    console.log(values);
  };
  useEffect(() => {
    const fetchUser = async () => {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      if (userCookie) {
        await getActualUser(userCookie, setActualUser, toast, navigate);
      }
      return () => clearTimeout(timer);
    };

    fetchUser();
  }, [userCookie, toast, navigate]);

  useEffect(() => {
    if (!isLoading && actualUser) {
      if (actualUser.niveauAccess !== "ADMIN") {
        toast({
          variant: "destructive",
          title: `Erreur`,
          description: `Ressources indisponibles pour votre niveau d'accès`,
        });
        navigate("/");
      }
    }
  }, [isLoading, actualUser, navigate, toast]);
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
              <div className="p-8 w-full max-w-md bg-white rounded-lg shadow-xl drop-shadow-xl shadow-black/10 dark:bg-slate-900 dark:shadow-primary">
                <div>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="nomFiliere"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom de la filiere</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nom de la nouvelle filiere"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription className="text-gray-900 dark:text-white">
                              Veuillez entrer le nom de la nouvelle filiere.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full">
                        Valider
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
