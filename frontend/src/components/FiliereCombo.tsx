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

type FiliereComboProps = {
  onFiliereSelect: (filiere: string) => void;
};

export default function FiliereCombo({ onFiliereSelect }: FiliereComboProps) {
  type Filiere = {
    id_filiere: number;
    nomFiliere: string;
  };

  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchFilieres = async () => {
      try {
        const req = await fetch(`http://localhost:5173/api/filiere/names`);
        const data = await req.json();
        const filieres: Filiere[] = data.filieres;
        setFilieres(filieres);
      } catch (error) {
        console.error("Erreur lors de la récupération des filières:", error);
        toast({
          variant: "destructive",
          title: `Erreur`,
          description:
            "Une erreur est survenue lors de la tentative de récupération des filières.",
        });
      }
    };
    fetchFilieres();
  }, [toast]);

  const handleSelect = (currentValue: string) => {
    setValue(currentValue);
    setOpen(false);
    onFiliereSelect(currentValue);
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
            ? filieres.find((filiere) => filiere.nomFiliere === value)
                ?.nomFiliere
            : "Select filiere..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search filiere..." className="h-9" />
          <CommandList>
            <CommandEmpty>No filiere found.</CommandEmpty>
            <CommandGroup>
              {filieres.map((filiere) => (
                <CommandItem
                  key={filiere.id_filiere}
                  value={filiere.nomFiliere}
                  onSelect={handleSelect}
                >
                  {filiere.nomFiliere}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === filiere.nomFiliere ? "opacity-100" : "opacity-0"
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
