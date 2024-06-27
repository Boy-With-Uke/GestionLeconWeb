import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "../ui/use-toast";
import { type Filiere } from "@/types";
const formSchema = z.object({
  name: z.string().min(1),
});

export default function EditForm({
  props,
  setIsOpen,
  onSuccess,
}: {
  props: Filiere;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onSuccess: () => void;
}) {
  const filiere = props;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: filiere?.nomFiliere,
    },
  });

  const isLoading = form.formState.isSubmitting;
  const { toast } = useToast();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const req = await fetch(
        `http://localhost:5173/api/filiere/${filiere.id_filiere}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nomFiliere: values.name,
          }),
        }
      );

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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-2 sm:px-0 px-4"
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2 md:col-span-1">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="John Doe"
                  className="text-md"
                  required
                  autoFocus
                />
              </FormControl>
              <FormMessage />
            </FormItem>
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
