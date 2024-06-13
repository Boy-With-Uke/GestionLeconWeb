import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";


function App() {
  type User = {
    id_user: number;
    nom: string;
    prenom: string;
    email: string;
    motDePasse: string;
    niveauAccess: string;
    coursUtilisateur: number;
  };
  const [count, setCount] = useState(0);



  useEffect(() => {
    const fetchUsers = async () =>{
      const res = await fetch('')
      const data: User = await res.json();


    }
  })

  return (
    <>
      <div className="flex flex-col bg-background max-w-md m-auto gap-5">
        <Button
          className="bg-primary"
          onClick={() => setCount((count) => count + 1)}
        >
          up
        </Button>
        <Button
          className="bg-primary"
          onClick={() => setCount((count) => count - 1)}
        >
          down
        </Button>
        <p>{count}</p>
      </div>
    </>
  );
}

export default App;
