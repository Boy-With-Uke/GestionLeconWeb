import { ModeToggle } from "./mode-toogle";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

import NavContent from "./NavContent";

export default function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-gray-300 shadow-sm dark:bg-gray-950/90">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-14 items-center">
          <Link to="#" className="flex items-center">
            <MountainIcon className="h-6 w-6" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          <nav className="hidden md:flex gap-4">
            <NavContent />
          </nav>
          <div className="flex items-center gap-4">
            <Link to={"/Connexion"}>
              <Button
                variant="outline"
                size="sm"
                className="text-primary hover:bg-primary hover:text-white"
              >
                Connexion
              </Button>
            </Link>
            <Link to={"/Inscription"}>
              <Button
                variant="outline"
                size="sm"
                className="text-primary hover:bg-primary hover:text-white"
              >
                Inscription
              </Button>
            </Link>
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

function MountainIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
