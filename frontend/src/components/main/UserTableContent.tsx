/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function UserTableContent() {
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  // Define the User type
  type User = {
    id_user: number;
    nom: string;
    prenom: string;
    email: string;
    niveauAccess: string;
    nomClasse?: string;
    nomFiliere?: string;
  };

  const columns: ColumnDef<User>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Tout selectioner"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "nom",
      header: "Nom",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("nom")}</div>
      ),
    },
    {
      accessorKey: "prenom",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Prenom
            <CaretSortIcon className="ml-2 w-4 h-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("prenom")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <CaretSortIcon className="ml-2 w-4 h-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "niveauAccess",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Statut
            <CaretSortIcon className="ml-2 w-4 h-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("niveauAccess")}</div>
      ),
    },
    {
      accessorKey: "nomClasse",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Classe
            <CaretSortIcon className="ml-2 w-4 h-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("nomClasse")}</div>
      ),
    },
    {
      accessorKey: "nomFiliere",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Filiere
            <CaretSortIcon className="ml-2 w-4 h-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("nomFiliere")}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 w-8 h-8">
                  <span className="sr-only">Open menu</span>
                  <DotsHorizontalIcon className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleUpgrade(user, "ADMIN")}>
                  Mettre Admin
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleUpgrade(user, "ENSEIGNANT")}
                >
                  Mettre Enseignant
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpgrade(user, "USER")}>
                  Mettre Utilisateur
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleDelete(user)}>
                  Supprimer
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedUser(user);
                    setIsEditDialogOpen(true);
                  }}
                >
                  Modifier
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [users, setUsers] = React.useState<User[]>([]);
  const { toast } = useToast();

  const getUser = async () => {
    try {
      const res = await fetch(`http://localhost:5173/api/user`);
      if (!res.ok) {
        toast({
          variant: "destructive",
          title: `Erreur`,
          description: `Erreur lors de la recuperation des utilisateurs`,
        });
        return;
      }
      const data = await res.json();
      const userGeted: User[] = data.users.map((user: any) => ({
        id_user: user.id_user,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        niveauAccess: user.niveauAccess,
        nomClasse: user.classe?.nomClasse,
        nomFiliere: user.classe?.classeFiliere?.nomFiliere,
      }));
      setUsers(userGeted);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  React.useEffect(() => {
    getUser();
  }, []);

  React.useEffect(() => {
    console.log(selectedUser);
  }, [selectedUser]);

  const table = useReactTable<User>({
    data: users,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  const handleDelete = async (user: User) => {
    const userId = user.id_user;
    try {
      const req = await fetch(`http://localhost:5173/api/user/${userId}`, {
        method: "DELETE",
      });
      const data = await req.json();
      if (req.status === 200) {
        toast({
          title: `Success`,
          description: data.message || `Mise a niveau reussi`,
        });
        getUser();
      }
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: `Erreur`,
        description: `Erreur lors de la suppression de l'utilisateurs`,
      });
    }
  };
  const handleUpgrade = async (user: User, type: string) => {
    setSelectedUser(user);
    handleChangeLevelAccess(type, user.id_user);
  };
  const handleChangeLevelAccess = async (type: string, idUser: number) => {
    const typeLevel = type;
    try {
      const req = await fetch(
        `http://localhost:5173/api/user/set/${typeLevel}/${idUser}`,
        {
          method: "PUT",
        }
      );
      const data = await req.json();
      if (req.status === 200) {
        toast({
          title: `Success`,
          description: data.message || `Mise a niveau reussi`,
        });
        getUser();
      }
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: `Erreur`,
        description: `Erreur lors de la mise a niveau de l'utilisateurs`,
      });
    }
  };
  const formSchema = z.object({
    id: z.number().min(1),
    nom: z
      .string()
      .min(3, { message: "Le nom doit avoir au minimum 3 charactere" }),
    prenom: z
      .string()
      .min(3, { message: "Le prenom doit avoir au minimum 3 charactere" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  React.useEffect(() => {
    if (selectedUser) {
      form.reset({
        id: selectedUser.id_user,
        nom: selectedUser.nom,
        prenom: selectedUser.prenom, // Si la classe est disponible, sinon mettre une valeur par défaut
      });
    }
  }, [selectedUser, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("Submitting values:", values);
      const req = await fetch(`http://localhost:5173/api/user/${values.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom: values.nom,
          prenom: values.prenom,
        }),
      });

      setIsEditDialogOpen(false);

      console.log("Response status:", req.status);
      const data = await req.json();
      console.log("Response data:", data);

      if (req.status === 200) {
        toast({
          title: "Success",
          description: data.message || "Mise à jour réussie",
        });
        getUser(); // appel de la fonction de rappel
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Erreur lors de la mise à jour",
        });
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const isLoading = form.formState.isSubmitting;
  return (
    <>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Modification de l'utilisateur {selectedUser?.id_user}
            </DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col space-y-2 sm:px-0 px-4"
            >
              <FormField
                control={form.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Nom de l'utilisateur" {...field} />
                    </FormControl>
                    <FormDescription className="text-gray-900 dark:text-white">
                      Veuillez entrer le nom de la leçon.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="prenom"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Prenom de l'utilisateur" {...field} />
                    </FormControl>
                    <FormDescription className="text-gray-900 dark:text-white">
                      Veuillez entrer le nom de la leçon.
                    </FormDescription>
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
        </DialogContent>
      </Dialog>
      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter emails..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDownIcon className="ml-2 w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-lg border shadow-xl drop-shadow-none shadow-black/10 bg-white dark:bg-slate-900 dark:shadow-primary">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-end items-center py-4 space-x-2">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
