import { useEffect, useState } from "react";

export const Statistics = () => {
  interface statsProps {
    quantity: number;
    description: string;
  }

  const [userCount, setUserCount] = useState(0);
  const [subjectCount, setsubjectCount] = useState(0);
  const [coursCount, setcoursCount] = useState(0);
  const [teacherCount, setteacherCount] = useState(0);

  const stats: statsProps[] = [
    {
      quantity: userCount,
      description: "Utilisateurs",
    },
    {
      quantity: subjectCount,
      description: "Matieres",
    },
    {
      quantity: coursCount,
      description: "Cours",
    },
    {
      quantity: teacherCount,
      description: "Enseignant",
    },
  ];

  useEffect(() => {
    const fetchStat = async () => {
      try {
        const req = await fetch(`http://localhost:5173/api/stat`);
        const data = await req.json();
        setUserCount(data.result.userCount);
        setsubjectCount(data.result.subjectCount);
        setcoursCount(data.result.coursCount);
        setteacherCount(data.result.teacherCount);
        console.log(data.result.result);
      } catch (error) {
        console.log(error);
      }
    };
    fetchStat()
  }, []);
  return (
    <section id="statistics">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map(({ quantity, description }: statsProps) => (
          <div key={description} className="space-y-2 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold ">{quantity}</h2>
            <p className="text-xl text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
