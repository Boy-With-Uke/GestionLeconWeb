import { Statistics } from "./Statistics";
import mesupres from "@/assets/Images/mesupres.png";

export const About = () => {
  return (
    <section id="about" className="container py-24 sm:py-32">
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
          <img
            src={mesupres}
            alt=""
            className="w-[300px] object-contain rounded-lg"
          />
          <div className="bg-green-0 flex flex-col justify-between">
            <div className="pb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="clip-text">A propos de </span>
                <span className="inline bg-gradient-to-r from-[#2bff79]  to-primary text-transparent bg-clip-text">
                  E-Hianatra
                </span>{" "}
              </h2>
              <p className="text-xl text-muted-foreground mt-4">
                E-hiasanatra est une plateforme éducative qui facilite la gestion
                des cours pour les enseignants et les étudiants. Elle permet de
                créer et organiser du contenu pédagogique de manière efficace,
                offrant un accès simplifié aux leçons, devoirs, et évaluations,
                visant à rendre l'éducation plus accessible et interactive grâce
                à une interface conviviale.
              </p>
            </div>

            <Statistics />
          </div>
        </div>
      </div>
    </section>
  );
};
