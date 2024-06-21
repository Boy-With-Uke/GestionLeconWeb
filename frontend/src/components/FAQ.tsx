import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "l'application est elle gratuite?",
    answer: "Oui l'application est totalement gratuite.",
    value: "item-1",
  },
  {
    question: "Les enseignants sont ils payees ?",
    answer:
      "E-Hianatra est un projet communautaire et a but non lucratif, de ce fait les enseignants ne sont pas payes.",
    value: "item-2",
  },
  {
    question:
      "Y aura t-il une version pour les ecoles primaires/colleges/lycees",
    answer: "Un ajout de ces etablissements est en cours",
    value: "item-3",
  },
];

export const Foire = () => {
  return (
    <section id="faq" className="container py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Les questions{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          les plus poses
        </span>
      </h2>

      <Accordion type="single" collapsible className="w-full AccordionRoot">
        {FAQList.map(({ question, answer, value }: FAQProps) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
