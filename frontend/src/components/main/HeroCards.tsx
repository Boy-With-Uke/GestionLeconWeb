import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { FacebookIcon, Linkedin } from "lucide-react";
import kerman from "@/assets/Images/kerman.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LightBulbIcon } from "./Icons2";

export const HeroCards = () => {
  return (
    <div className="hidden lg:flex flex-row flex-wrap gap-8 relative w-[700px] h-[500px]">
      {/* Testimonial */}
      <Card className="absolute w-[340px] top-[10px] drop-shadow-xl shadow-black/10 bg-white dark:shadow-primary dark:bg-slate-900">
        <CardHeader className="flex flex-row gap-4 items-center pb-2">
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
        <CardHeader className="flex justify-center items-center pb-2 mt-8">
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

        <CardContent className="pb-2 text-center">
          <p>Transformer vos reves en choses concretes est ma passion</p>
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
        <CardHeader className="flex gap-4 justify-start items-start space-y-1 md:flex-row">
          <div className="p-1 mt-1 rounded-2xl bg-primary/20">
            <LightBulbIcon />
          </div>
          <div>
            <CardTitle>Moins de temps perdue</CardTitle>
            <CardDescription className="mt-2 text-md">
              Tous vos documents disponible partout
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};
