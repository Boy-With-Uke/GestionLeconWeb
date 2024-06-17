"use client";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Navbar from "@/components/navbar";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
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
import OrbitingLoader from "@/components/OrbitingLoader";
import { useEffect, useState } from "react";
import { Footer } from "@/components/Footer";
import FiliereCombo from "@/components/FiliereCombo";
import ClassCombo from "@/components/ClassCombo";

const formSchema = z
  .object({
    name: z.string(),
    filiere: z.string(),
    classe: z.string(),
    firstName: z.string(),
    email: z.string().min(2, {
      message: "L'email doit au minimum contenir 2 caractères",
    }),
    password: z.string().min(8, {
      message: "Le mot de passe doit au minimum contenir 8 caractères",
    }),
    password2: z.string().min(8, {
      message: "Le mot de passe doit au minimum contenir 8 caractères",
    }),
  })
  .refine((data) => data.password === data.password2, {
    message: "Les deux mots de passe doivent être identiques",
    path: ["password2"], // path of error
  });

export default function Inscription() {
  const { toast } = useToast();
  const navigate = useNavigate();
   const userCookie = Cookies.get("user");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFiliere, setSelectedFiliere] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      firstName: "",
      classe: "",
      filiere: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const req = await fetch(`http://localhost:5173/api/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom: values.name,
          prenom: values.firstName,
          email: values.email,
          classe: values.classe,
          motDePasse: values.password,
        }),
      });

      const data = await req.json();

      if (req.status === 401) {
        toast({
          variant: "destructive",
          title: `Erreur`,
          description: data.message || "Email déjà lié à un compte",
        });
      } else if (req.status === 200) {
        toast({
          title: `Félicitations`,
          description: `Inscription réussie`,
        });
        navigate("/");
        Cookies.set("user", data.newUser.id_user, { expires: 7, path: "/" });
      } else {
        toast({
          variant: "destructive",
          title: `Erreur`,
          description: data.message || "Une erreur est survenue",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      toast({
        variant: "destructive",
        title: `Erreur`,
        description:
          "Une erreur est survenue lors de la tentative d'inscription.",
      });
    }

    console.log(values);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

    function redirection() {
      if (userCookie) {
        navigate("/");
      }
    }

    useEffect(() => {
      redirection();
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
          <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950">
            <Navbar />
            <div className="bg-white p-8 rounded-lg shadow-xl drop-shadow-xl shadow-black/10 w-full max-w-4xl dark:bg-slate-900 dark:shadow-primary">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-center">
                  Inscription
                </h2>
              </div>
              <div>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="flex space-x-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Nom</FormLabel>
                            <FormControl>
                              <Input placeholder="Nom" {...field} />
                            </FormControl>
                            <FormDescription className="text-gray-900 dark:text-white">
                              Veuillez entrer votre nom.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Prénom</FormLabel>
                            <FormControl>
                              <Input placeholder="Prénom" {...field} />
                            </FormControl>
                            <FormDescription className="text-gray-900 dark:text-white">
                              Veuillez entrer votre prénom.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="flex justify-center">
                          <div className="w-full max-w-md">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Email" {...field} />
                            </FormControl>
                            <FormDescription className="text-gray-900 dark:text-white">
                              Veuillez entrer votre email.
                            </FormDescription>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="flex space-x-4">
                      <FormField
                        control={form.control}
                        name="filiere"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Filière</FormLabel>
                            <FormControl>
                              <FiliereCombo
                                onFiliereSelect={(filiere) => {
                                  field.onChange(filiere);
                                  setSelectedFiliere(filiere);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="classe"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Classe</FormLabel>
                            <FormControl>
                              <ClassCombo
                                queryParam={selectedFiliere}
                                onSelect={(classe) => field.onChange(classe)} // Ajout de la fonction de rappel
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex space-x-4">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Mot de passe</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Mot de passe"
                                {...field}
                                type="password"
                              />
                            </FormControl>
                            <FormDescription className="text-gray-900 dark:text-white">
                              Veuillez entrer votre mot de passe.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="password2"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Confirmez votre mot de passe</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Mot de passe"
                                {...field}
                                type="password"
                              />
                            </FormControl>
                            <FormDescription className="text-gray-900 dark:text-white">
                              Entrer de nouveau votre mot de passe.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      S'inscrire
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
}
