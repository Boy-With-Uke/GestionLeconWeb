/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { type Lesson } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "../ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  id: z.number().min(1),
  type: z.enum(["LESSON", "EVALUATION"]),
  newTitre: z.string().min(1),
  file: z
    .instanceof(FileList)
    .refine((files) => files.length === 1, "Veuillez télécharger un fichier"),
});

export default function EditForm({
  props,
  setIsOpen,
  onSuccess,
}: {
  props: Lesson;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onSuccess: () => void;
}) {
  const lesson = props;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: lesson?.id_lecon,
      newTitre: lesson?.titre,
      file: {} as FileList,
      type: lesson.typeLecon,
    },
  });

  const isLoading = form.formState.isSubmitting;
  const { toast } = useToast();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
    const fileName = `Lesson-${values.newTitre}-${yearMonthDayHourMinSec}.${fileExtension}`;
    const formData = new FormData();
    formData.append("file", values.file[0]);
    formData.append("id", lesson.id_lecon.toString());
    formData.append("filename", fileName);
    formData.append("newTitre", values.newTitre);
    formData.append("typeLecon", values.type);
    try {
      const req = await fetch(`http://localhost:5173/api/lesson`, {
        method: "PUT",
        body: formData,
      });

      const data = await req.json();
      if (req.status === 200) {
        toast({
          title: "Success",
          description: data.message || "Mise à jour réussie",
        });
        onSuccess(); // appel de la fonction de rappel
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Erreur lors de la mise à jour",
        });
      }
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files;
    form.setValue("file", file || ({} as FileList));
  };

  const handleTypeChange = (type: "LESSON" | "EVALUATION") => {
    form.setValue("type", type);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-2 sm:px-0 px-4"
      >
        <FormField
          control={form.control}
          name="newTitre"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Nom de la nouvelle leçon" {...field} />
              </FormControl>
              <FormDescription className="text-gray-900 dark:text-white">
                Veuillez entrer le nom de la leçon.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormControl>
            <Input type="file" onChange={handleFileChange} accept=".pdf" />
          </FormControl>
          <FormDescription className="text-gray-900 dark:text-white">
            Veuillez télécharger le fichier de la leçon.
          </FormDescription>
          <FormMessage />
        </FormItem>

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="lesson"
                checked={field.value === "LESSON"}
                onCheckedChange={() => handleTypeChange("LESSON")}
              />
              <label
                htmlFor="lesson"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                LESSON
              </label>

              <Checkbox
                id="evaluation"
                checked={field.value === "EVALUATION"}
                onCheckedChange={() => handleTypeChange("EVALUATION")}
              />
              <label
                htmlFor="evaluation"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                EVALUATION
              </label>
            </div>
          )}
        />

        <div className="flex w-full sm:justify-end mt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
