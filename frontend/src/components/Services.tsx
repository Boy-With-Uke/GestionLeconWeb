import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { MagnifierIcon, WalletIcon, ChartIcon } from "./Icons2";
import cubeLeg from "../assets/Images/cube-leg.png";

interface ServiceProps {
  title: string;
  description: string;
  icon: JSX.Element;
}

const serviceList: ServiceProps[] = [
  {
    title: "Transparence",
    description:
      "Projet opensource, ouvert aux ameliorations et a l'ajout de colaborateurs",
    icon: <ChartIcon />,
  },
  {
    title: "Flexibilité",
    description:
      "E-hanatra est conçu pour être utilisé sur divers appareils, permettant aux utilisateurs d'accéder à la plateforme à tout moment et en tout lieu.",
    icon: <WalletIcon />,
  },
  {
    title: "Ressources Éducatives Riches et Accessibles",
    description:
      "E-hanatra offre une vaste bibliothèque de ressources éducatives, incluant des vidéos, des documents, et des exercices interactifs. Cela permet aux étudiants d'apprendre à leur propre rythme et d'avoir accès à du matériel supplémentaire pour approfondir leurs connaissances en dehors des heures de cours.",
    icon: <MagnifierIcon />,
  },
];

export const Services = () => {
  return (
    <section className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-[1fr,1fr] gap-8 place-items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              Client-Centric{" "}
            </span>
            Services
          </h2>

          <p className="text-muted-foreground text-xl mt-4 mb-8 ">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veritatis
            dolor.
          </p>

          <div className="flex flex-col gap-8">
            {serviceList.map(({ icon, title, description }: ServiceProps) => (
              <Card key={title} className="dark:bg-slate-900">
                <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
                  <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
                    {icon}
                  </div>
                  <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription className="text-md mt-2">
                      {description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <img
          src={cubeLeg}
          className="w-[300px] md:w-[500px] lg:w-[600px] object-contain"
          alt="About services"
        />
      </div>
    </section>
  );
};
