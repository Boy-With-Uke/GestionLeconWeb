"use client";
import ClassComboId from "@/components/ClassComboId";
import EnseignantCombo from "@/components/EnseignantCombo";
import FiliereCombo from "@/components/FiliereCombo";
import OrbitingLoader from "@/components/OrbitingLoader";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/navbar";
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
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  nomMatiere: z.string().min(3, {
    message: "Le nom de la matiere doit etre au minimum 3 caracteres",
  }),
  description: z.string().min(5, {
    message: "La description de la matiere doit etre au minimum 3 caracteres",
  }),
  classeId: z.number().min(1, {
    message: "Veillez selectioner une classe",
  }),
  nomFiliere: z.string().min(1, {
    message: "Vous devez selectionner le nom de la filiere",
  }),
  idProf: z.number().min(1, { message: "Veillez selectioner le professeur" }),
});
export default function AjoutMatiere() {
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
  const [selectedFiliere, setSelectedFiliere] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomMatiere: "",
      description: "",
      classeId: 0,
      nomFiliere: "",
      idProf: 0,
    },
  });
  // 1. Define your form
  const getActualUser = async () => {
    if (!userCookie) {
      toast({
        variant: "destructive",
        title: `Erreur`,
        description: "Vous devez vous connecter pour acceder a cette ressource",
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
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const req = await fetch(`http://localhost:5173/api/matiere`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom: values.nomMatiere,
          description: values.description,
          enseignantDelaMatiere: values.idProf,
          id_classe: values.classeId,
        }),
      });

      const data = await req.json();

      if (req.status === 401) {
        toast({
          variant: "destructive",
          title: `Erreur`,
          description: data.message || "Matiere deja existante",
        });
      } else if (req.status === 200) {
        toast({
          title: `Success`,
          description: data.message || " Nouvelle Matiere créé avec succès",
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
              <div className="p-8 w-full max-w-md bg-white rounded-lg shadow-xl drop-shadow-xl shadow-black/10 dark:bg-slate-900 dark:shadow-primary">
                <div>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="nomMatiere"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Nom de la nouvelle filiere"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription className="text-gray-900 dark:text-white">
                              Veuillez entrer le nom de la nouvelle Matiere.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Description de la nouvelle filiere"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription className="text-gray-900 dark:text-white">
                              Veuillez entrer une description de la nouvelle
                              Matiere.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="nomFiliere"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <FiliereCombo
                                onFiliereSelect={(filiere) => {
                                  field.onChange(filiere);
                                  setSelectedFiliere(filiere);
                                }}
                              />
                            </FormControl>
                            <FormDescription className="text-gray-900 dark:text-white">
                              Veuillez entrer la filiere de cette Matiere.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="classeId"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <ClassComboId
                                queryParam={selectedFiliere}
                                onSelect={(classe) => field.onChange(classe)} // Ajout de la fonction de rappel
                              />
                            </FormControl>
                            <FormDescription className="text-gray-900 dark:text-white">
                              Veuillez entrer la classe d'attribution de cette
                              Matiere.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="idProf"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <EnseignantCombo
                                onSelect={(enseignant) =>
                                  field.onChange(enseignant)
                                } // Ajout de la fonction de rappel
                              />
                            </FormControl>
                            <FormDescription className="text-gray-900 dark:text-white">
                              Veuillez entrer la classe d'attribution de cette
                              Matiere.
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
