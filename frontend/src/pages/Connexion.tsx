"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import OrbitingLoader from "@/components/OrbitingLoader";
import { useEffect, useState } from "react";
import { Footer } from "@/components/Footer";

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
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values.password);
  }
    useEffect(() => {
      // Show the loader for at least 3 seconds
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);

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
          <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950">
            <Navbar />
            <div className="  bg-white p-8 rounded-lg shadow-xl drop-shadow-xl shadow-black/10 w-full max-w-md dark:bg-slate-900 dark:shadow-primary">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-center">
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
                          <FormDescription className=" text-gray-900 dark:text-white">
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
          <Footer/>
        </>
      )}
    </>
  );
}
