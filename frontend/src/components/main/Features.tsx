import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import image from "@/assets/Images/growth.png";
import image4 from "@/assets/Images/looking-ahead.png";
import image3 from "@/assets/Images/reflecting.png";
import { Badge } from "@/components/ui/badge";

interface FeatureProps {
  title: string;
  description: string;
  image: string;
}

const features: FeatureProps[] = [
  {
    title: "Filtrage",
    description:
      "Les matiereset les cours sont filtrees selon votre classe, plus besoin de chercher loin",
    image: image4,
  },
  {
    title: "Interface utilisateur intuitif",
    description:
      "Notre application offre un design intuitive et modern tout en conservant sa fluidite",
    image: image3,
  },
  {
    title: "Contenu sous pdf",
    description:
      "Nos lecons et evaluations sont sous pdf pour une meilleur manipulation",
    image: image,
  },
];

const featureList: string[] = [
  "Dark/Light theme",
  "Favoris",
  "Filtrage",
  "Pdf",
  "Contenu simple",
  "Recherche",
];

export const Features = () => {
  return (
    <section id="features" className="container py-24 sm:py-32 space-y-8">
      <h2 className="text-3xl lg:text-4xl font-bold md:text-center">
        Many{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Great Features
        </span>
      </h2>

      <div className="flex flex-wrap md:justify-center gap-4">
        {featureList.map((feature: string) => (
          <div key={feature}>
            <Badge variant="secondary" className="text-sm">
              {feature}
            </Badge>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(({ title, description, image }: FeatureProps) => (
          <Card
            key={title}
            className="shadow-black/10 bg-white dark:shadow-primary dark:bg-slate-900"
          >
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>

            <CardContent>{description}</CardContent>

            <CardFooter>
              <img
                src={image}
                alt="About feature"
                className="w-[200px] lg:w-[300px] mx-auto"
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
