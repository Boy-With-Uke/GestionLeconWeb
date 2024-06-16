import { Button } from "./ui/button";
import { buttonVariants } from "./ui/button";
import { HeroCards } from "./HeroCards";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl md:text-4xl font-bold">
          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-[#2bff79]  to-primary text-transparent bg-clip-text">
              E-Hianatra
            </span>{" "}
            ,votre ecole
          </h1>{" "}
          modern par{" "}
          <h2 className="inline">
            <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
              MESUPRES
            </span>{" "}
            en collaboration avec l'
          </h2>
          <h2 className="inline bg-gradient-to-r from-yellow-200  to-yellow-500 text-transparent bg-clip-text">
            ESMIA
          </h2>{" "}
          <span>pour une vie d'etudiant plus simple</span>
        </main>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Link to="/Connexion">
            <Button className="w-full md:w-1/3">Se connecter</Button>
          </Link>
          <Link to={"/Inscription"}>
            <Button
              variant="outline"
              size="sm"
              className="text-primary hover:bg-primary hover:text-white w-full md:w-1/3"
            >
              Inscription
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero cards sections */}
      <div className="z-10">
        <HeroCards />
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
};
