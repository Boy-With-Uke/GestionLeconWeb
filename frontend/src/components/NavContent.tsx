"use client";

import * as React from "react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Liste des lecons",
    href: "/docs/primitives/alert-dialog",
    description:
      "Une liste de lecons faites par des enseignants chevronnes",
  },
  {
    title: "Liste des enseignants",
    href: "/docs/primitives/hover-card",
    description:
      "Les enseignants experimentees choisi par nos soins",
  },
  {
    title: "Liste des matieres",
    href: "/docs/primitives/progress",
    description:
      "Les matieres que nos enseignants enseignent",
  },
  {
    title: "Liste des evaluations",
    href: "/docs/primitives/scroll-area",
    description: "Les evaluations que vous devriez suivre",
  },
  {
    title: "Liste des cours",
    href: "/docs/primitives/tabs",
    description:
      "Les cours de chaque matieres que vous pouvez suivre",
  },
  {
    title: "Les contributteurs",
    href: "/docs/primitives/tooltip",
    description:
      "Ceux qui contribue chaque jour a l'amelioration de cette application",
  },
];

export default function NavContent() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Acceuil
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="hover:bg-primary hover:text-accent-foreground focus:bg-primary focus:text-accent-foreground">
            Commencer a etudier
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] dark:bg-slate-900">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary to-white dark:from-primary dark:to-dark:bg-slate-900 p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <Icons.logo className="h-6 w-6" />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      E-hanatra
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Une application pour les profs mais surtout pour les
                      etudiants
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/docs" title="Creer un compte">
                Si vous n'avez pas encore de compte veuillez vous-en creer un,
                c'est completement gratuit
              </ListItem>
              <ListItem href="/docs/installation" title="Se connecter">
                Si vous avez deja un compte, vous pouvez vous connecter en
                utilisants vos identifiants
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="hover:bg-primary hover:text-accent-foreground focus:bg-primary focus:text-accent-foreground">
            Nos Services
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] dark:bg-slate-900">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/docs">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              En s'avoir plus
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary hover:text-accent-foreground focus:bg-primary focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
