"use client";
import { Footer } from "@/components/Footer";
import OrbitingLoader from "@/components/OrbitingLoader";
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
  email: z.string().min(2, {
    message: "L'email doit au minimum contenir 10 character",
  }),
  password: z.string().min(1, {
    message: "Le mot de passe doit au minimum contenir 8 character",
  }),
});

export default function Connexion() {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const userCookie = Cookies.get("user");
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const req = await fetch(`http://localhost:5173/api/user/connexion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          motDePasse: values.password,
        }),
      });

      const data = await req.json();

      if (req.status === 404) {
        toast({
          variant: "destructive",
          title: `Erreur`,
          description:
            data.message ||
            "Aucun compte trouvee veuillez verifier vos identifiants",
        });
      } else if (req.status === 200) {
        toast({
          title: `Connexion réussie`,
          description: `Connecter en tant que ${data.existingUser.nom} ${data.existingUser.prenom}`,
        });
        navigate("/");
        Cookies.set("user", data.existingUser.id_user, {
          expires: 7,
          path: "/",
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
    // Show the loader for at least 3 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Clear the timer if the component unmounts
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
          <div className="flex justify-center items-center min-h-screen bg-slate-100 dark:bg-slate-950">
            <Navbar />
            <div className="p-8 w-full max-w-md bg-white rounded-lg shadow-xl drop-shadow-xl shadow-black/10 dark:bg-slate-900 dark:shadow-primary">
              <div>
                <h2 className="mb-4 text-2xl font-bold text-center">
                  Connexion
                </h2>
              </div>
              <div>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Email" {...field} />
                          </FormControl>
                          <FormDescription className="text-gray-900 dark:text-white">
                            Veuillez entrer l'Email lier a votre compte.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mot de passe</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Email"
                              {...field}
                              type="password"
                            />
                          </FormControl>
                          <FormDescription className="text-gray-900 dark:text-white">
                            Veuillez entrer l'Email lier a votre compte.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      Se connecter
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
