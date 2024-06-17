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
};

export default function ClassCombo({ queryParam }: ClassComboProps) {
  type Classe = {
    id_classe: number;
    nomClasse: string;
  };

  const [classes, setClasses] = useState<Classe[]>([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
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

  const handleSelect = (currentValue: string) => {
    setValue(currentValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? classes.find((classe) => classe.nomClasse === value)?.nomClasse
            : "Select classe..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search classe..." className="h-9" />
          <CommandList>
            <CommandEmpty>No classe found.</CommandEmpty>
            <CommandGroup>
              {classes.map((classe) => (
                <CommandItem
                  key={classe.id_classe}
                  value={classe.nomClasse}
                  onSelect={handleSelect}
                >
                  {classe.nomClasse}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === classe.nomClasse ? "opacity-100" : "opacity-0"
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
