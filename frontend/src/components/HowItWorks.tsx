import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MedalIcon, MapIcon, PlaneIcon, GiftIcon } from "../components/Icons2";

interface FeatureProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    icon: <MedalIcon />,
    title: "Accessibiliter",
    description:
      "Un serveur dedier au sein du ministere de l'education",
  },
  {
    icon: <MapIcon />,
    title: "Communaute",
    description:
      "Des professeurs experimentes prets a vous donner le meilleur d'eux meme",
  },
  {
    icon: <PlaneIcon />,
    title: "Lisabiliter",
    description:
      "Les cours sous formes pdf pour une meilleur lisibiliter",
  },
  {
    icon: <GiftIcon />,
    title: "Favorisation",
    description:
      "Stocker vos cours les plus utiles pour y acceder en quelques cliques",
  },
];

export const HowItWorks = () => {
  return (
    <section
      id="howItWorks"
      className="container text-center py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold ">
        Comment{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          ca{" "}
        </span>
        marche ?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 mt-6 lg:grid-cols-4 gap-8">
        {features.map(({ icon, title, description }: FeatureProps) => (
          <Card
            key={title}
            className="bg-muted/50"
          >
            <CardHeader>
              <CardTitle className="grid gap-4 place-items-center">
                {icon}
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>{description}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
