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
  onSelect: (matieresId: number) => void; // Changement de type pour retourner l'ID de la classe
};

export default function MatiereCombo({ onSelect }: ClassComboProps) {
  type Matiere = {
    id_matiere: number;
    nom: string;
  };

  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedMatiereId, setSelectedMatiereId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const req = await fetch(`http://localhost:5173/api/matiere/names`);
        const data = await req.json();
        const matieres: Matiere[] = data.matieres;
        setMatieres(matieres);
      } catch (error) {
        console.error("Erreur lors de la récupération des maieres:", error);
        toast({
          variant: "destructive",
          title: `Erreur`,
          description:
            "Une erreur est survenue lors de la tentative de récupération des classes.",
        });
      }
    };
    fetchClasses();
  }, [ toast]);

  const handleSelect = (id: number) => {
    setSelectedMatiereId(id);
    setOpen(false);
    onSelect(id); // Appel de la fonction de rappel avec l'ID de la classe
  };

  const selectedMatiereName = matieres.find(
    (matiere) => matiere.id_matiere === selectedMatiereId
  )?.nom;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between dark:hover:bg-primary"
        >
          {selectedMatiereName || "Matieres..."}
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
            <CommandEmpty>Aucune matieres trouvée.</CommandEmpty>
            <CommandGroup>
              {matieres.map((matiere) => (
                <CommandItem
                  key={matiere.id_matiere}
                  value={matiere.id_matiere.toString()}
                  onSelect={() => handleSelect(matiere.id_matiere)}
                  className="dark:hover:bg-primary"
                >
                  {matiere.nom}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedMatiereId === matiere.id_matiere
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
