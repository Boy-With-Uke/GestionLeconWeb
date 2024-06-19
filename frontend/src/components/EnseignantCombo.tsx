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

type EnseignantComboProps = {
  onSelect: (enseignantId: number) => void; // Changement de type pour retourner l'ID de l'utilisateur
};

export default function EnseignantCombo({ onSelect }: EnseignantComboProps) {
  type User = {
    id_user: number;
    nom: string;
    niveauAccess: string;
  };

  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEnseignant = async () => {
      try {
        const req = await fetch(`http://localhost:5173/api/user`);
        const data = await req.json();
        const users: User[] = data.users;
        const userFiltered: User[] = users.filter(
          (user) => user.niveauAccess === "ENSEIGNANT"
        );
        console.log(userFiltered);
        setUsers(userFiltered);
      } catch (error) {
        console.error("Erreur lors de la récupération des enseignants:", error);
        toast({
          variant: "destructive",
          title: `Erreur`,
          description:
            "Une erreur est survenue lors de la tentative de récupération des enseignants.",
        });
      }
    };
    fetchEnseignant();
  }, [toast]);

  const handleSelect = (id: number) => {
    setSelectedUserId(id);
    setOpen(false);
    onSelect(id); // Appel de la fonction de rappel avec l'ID de l'utilisateur
  };

  const selectedUserName = users.find(
    (user) => user.id_user === selectedUserId
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
          {selectedUserName || "Enseignant..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 dark:bg-slate-900">
        <Command className="dark:bg-slate-900">
          <CommandInput
            placeholder="Rechercher un enseignant..."
            className="h-9 dark:bg-slate-900"
          />
          <CommandList>
            <CommandEmpty>Aucun enseignant trouvé.</CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.id_user}
                  value={user.id_user.toString()}
                  onSelect={() => handleSelect(user.id_user)}
                  className="dark:hover:bg-primary"
                >
                  {user.nom}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedUserId === user.id_user
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
