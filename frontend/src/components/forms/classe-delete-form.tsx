/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { type Classe } from "@/types";
import { useToast } from "../ui/use-toast";

const formSchema = z.object({
  id: z.number(),
});

export default function DeleteForm({
  props,
  setIsOpen,
  onSuccess,
}: {
  props: Classe;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onSuccess: () => void;
}) {
  const classe = props;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: classe?.id_classe,
    },
  });
  const isLoading = form.formState.isSubmitting;
  const { toast } = useToast();

  const onSubmit = async () => {
    try {
      const req = await fetch(
        `http://localhost:5173/api/classe/${classe.id_classe}`,
        {
          method: "DELETE",
        }
      );
      console.log(req);
      const data = await req.json();
      if (req.status === 200) {
        toast({
          title: `Success`,
          description: data.message || `Suppresion reussi`,
        });
        onSuccess();
      } else {
        toast({
          variant: "destructive",
          title: `Erreur`,
          description: `Erreur lors de la suppression`,
        });
      }
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6  sm:px-0 px-4"
      >
        <div className="w-full flex justify-center sm:space-x-6">
          <Button
            size="lg"
            variant="outline"
            disabled={isLoading}
            className="w-full hidden sm:block"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            Retour
          </Button>
          <Button
            size="lg"
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-500 hover:bg-red-400"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Supprimer
              </>
            ) : (
              <span>Delete</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
