"use client";
import MatiereCombo from "@/components/MatiereCombo";
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
import { type User } from "@/types";
import { getActualUser } from "@/utils/function";

const formSchema = z.object({
  titre: z.string().min(3, {
    message: "Le titre de la leçon doit être au minimum 3 caractères",
  }),
  matiere: z.number().min(1, {
    message: "Vous devez choisir une matiere",
  }),
  file: z
    .instanceof(FileList)
    .refine((files) => files.length === 1, "Veuillez télécharger un fichier"),
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function AjoutLecon() {
  const [actualUser, setActualUser] = useState<User | null>(null);
  const userCookie = Cookies.get("user");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titre: "",
      matiere: 0,
      file: {} as FileList, // Initialiser le champ du fichier
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files;
    form.setValue("file", file || ({} as FileList));
  };

  // 1. Define your form;

  const onSubmit = async (values: FormSchemaType) => {
    const allowedExtensions = ["pdf"];
    const fileExtension = values.file[0].name.split(".").pop()?.toLowerCase();

    if (
      fileExtension === undefined ||
      !allowedExtensions.includes(fileExtension)
    ) {
      toast({
        variant: "destructive",
        title: `Erreur`,
        description: `Extension de fichier non valide`,
      });
      return;
    }
    const actualDate = new Date();
    const isoString = actualDate.toISOString();
    const yearMonthDayHourMinSec = isoString.substring(0, 19).replace("T", "_");
    const fileName = `Lesson-${values.titre}-${yearMonthDayHourMinSec}.${fileExtension}`;
    const formData = new FormData();
    formData.append("file", values.file[0]);
    formData.append("filename", fileName);
    formData.append("titre", values.titre);
    formData.append("matiere", values.matiere.toString());
    formData.append("typeLecon", "LESSON");

    try {
      const req = await fetch(`http://localhost:5173/api/lesson`, {
        method: "POST",
        body: formData,
      });

      const data = await req.json();

      if (req.status === 401) {
        toast({
          variant: "destructive",
          title: `Erreur`,
          description: data.message || "Lecon déjà existante",
        });
      } else if (req.status === 200) {
        toast({
          title: `Succès`,
          description: data.message || "Nouvelle lecon créée avec succès",
        });
      } else {
        toast({
          variant: "destructive",
          title: `Erreur`,
          description: data.message || "Une erreur est survenue",
        });
      }
    } catch (error) {
      console.error("Erreur:", error);
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
      if (
        actualUser.niveauAccess !== "ADMIN" &&
        actualUser.niveauAccess !== "ENSEIGNANT"
      ) {
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
                        name="titre"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Nom de la nouvelle leçon"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription className="text-gray-900 dark:text-white">
                              Veuillez entrer le nom de la leçon.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="matiere"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <MatiereCombo
                                onSelect={(matiereId) =>
                                  field.onChange(matiereId)
                                } // Ajout de la fonction de rappel
                              />
                            </FormControl>
                            <FormDescription className="text-gray-900 dark:text-white">
                              Veuillez entrer la classe d'attribution de cette
                              Matière.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormItem>
                        <FormControl>
                          <Input
                            type="file"
                            onChange={handleFileChange}
                            accept=".pdf"
                          />
                        </FormControl>
                        <FormDescription className="text-gray-900 dark:text-white">
                          Veuillez télécharger le fichier de la leçon.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>

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
