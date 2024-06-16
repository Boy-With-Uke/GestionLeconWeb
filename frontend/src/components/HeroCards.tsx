import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import kerman from '../assets/kerman.png'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Check, Linkedin } from "lucide-react";
import { LightBulbIcon } from "./Icons2";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { FacebookIcon } from "lucide-react";

export const HeroCards = () => {
  return (
    <div className="hidden lg:flex flex-row flex-wrap gap-8 relative w-[700px] h-[500px]">
      {/* Testimonial */}
      <Card className="absolute w-[340px] -top-[15px] drop-shadow-xl shadow-black/10 bg-white dark:shadow-primary dark:bg-slate-900">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar>
            <AvatarImage
              alt=""
              src="https://www.mesupres.gov.mg/assets/front/images/sites/ministres/ministre_mesupres.jpg"
            />
            <AvatarFallback>Ministre</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <CardTitle className="text-base">
              RAZAFIHARISON Andriamanantena
            </CardTitle>
            <CardDescription>
              Ministre de l'Enseignement Supérieur et de la Recherche
              Scientifique
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          Dès ma prise de fonction en janvier 2024, je suis déterminé à relever
          les défis suivants : faire de l’enseignement supérieur et de la
          recherche scientifique un réel moteur de développement de Madagascar,
          garantir la paix sociale dans le monde universitaire et instaurer un
          enseignement de qualité. Figure également dans les principales
          priorités l’instauration de la bonne gouvernance.
        </CardContent>
      </Card>

      {/* Team */}
      <Card className="absolute right-[20px] top-4 w-80 flex flex-col justify-center items-center drop-shadow-xl shadow-black/10 bg-white dark:shadow-primary dark:bg-slate-900">
        <CardHeader className="mt-8 flex justify-center items-center pb-2">
          <img
            src={kerman}
            alt="user avatar"
            className="absolute grayscale-[0%] -top-12 rounded-full w-24 h-24 aspect-square object-cover"
          />
          <CardTitle className="text-center">Kerman Arivelo</CardTitle>
          <CardDescription className="font-normal text-primary">
            Developpeur Junior
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center pb-2">
          <p>Transformer vos reves en choses concretes et ma passion</p>
        </CardContent>

        <CardFooter>
          <div>
            <a
              rel="noreferrer noopener"
              href="https://github.com/kermanArivelo"
              target="_blank"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
              })}
            >
              <span className="sr-only">Github icon</span>
              <GitHubLogoIcon className="w-5 h-5" />
            </a>
            <a
              rel="noreferrer noopener"
              href="https://www.facebook.com/kerman.randrianarivelo/"
              target="_blank"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
              })}
            >
              <span className="sr-only">Github icon</span>
              <FacebookIcon className="w-5 h-5" />
            </a>

            <a
              rel="noreferrer noopener"
              href="https://www.linkedin.com/"
              target="_blank"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
              })}
            >
              <span className="sr-only">Linkedin icon</span>
              <Linkedin size="20" />
            </a>
          </div>
        </CardFooter>
      </Card>

      

      {/* Service */}
      <Card className="absolute w-[350px] -right-[10px] bottom-[35px]  drop-shadow-xl shadow-black/10 bg-white dark:shadow-primary dark:bg-slate-900">
        <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
          <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
            <LightBulbIcon />
          </div>
          <div>
            <CardTitle>Moins de temps perdue</CardTitle>
            <CardDescription className="text-md mt-2">
              Tous vos documents disponible partout
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};
