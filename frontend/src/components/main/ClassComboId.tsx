"use client";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";

type ClassComboProps = {
  queryParam: string;
  onSelect: (classeId: number) => void; // Changement de type pour retourner l'ID de la classe
};

export default function ClassComboId({
  queryParam,
  onSelect,
}: ClassComboProps) {
  type Classe = {
    id_classe: number;
    nomClasse: string;
  };

  const [classes, setClasses] = useState<Classe[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedClasseId, setSelectedClasseId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchClasses = async () => {
      if (queryParam) {
        try {
          const req = await fetch(
            `http://localhost:5173/api/classe/names/${queryParam}`
          );
          const data = await req.json();
          const classes: Classe[] = data.classes;
          setClasses(classes);
        } catch (error) {
          console.error("Erreur lors de la récupération des classes:", error);
          toast({
            variant: "destructive",
            title: `Erreur`,
            description:
              "Une erreur est survenue lors de la tentative de récupération des classes.",
          });
        }
      }
    };
    fetchClasses();
  }, [queryParam, toast]);

  const handleSelect = (id: number) => {
    setSelectedClasseId(id);
    setOpen(false);
    onSelect(id); // Appel de la fonction de rappel avec l'ID de la classe
  };

  const selectedClasseName = classes.find(
    (classe) => classe.id_classe === selectedClasseId
  )?.nomClasse;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between dark:hover:bg-primary"
        >
          {selectedClasseName || "Classe..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 dark:bg-slate-900">
        <Command className="dark:bg-slate-900">
          <CommandInput
            placeholder="Rechercher une classe..."
            className="h-9 dark:bg-slate-900"
          />
          <CommandList>
            <CommandEmpty>Aucune classe trouvée.</CommandEmpty>
            <CommandGroup>
              {classes.map((classe) => (
                <CommandItem
                  key={classe.id_classe}
                  value={classe.id_classe.toString()}
                  onSelect={() => handleSelect(classe.id_classe)}
                  className="dark:hover:bg-primary"
                >
                  {classe.nomClasse}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedClasseId === classe.id_classe
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
