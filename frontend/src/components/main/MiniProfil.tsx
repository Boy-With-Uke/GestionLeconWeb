import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
export type MiniProfilProps = {
  nom: string;
  prenom: string;
  email: string;
};
export default function MiniProfil({ nom, prenom, email }: MiniProfilProps) {
  const navigate = useNavigate();
  return (
    <>
      <Card
        onClick={() => navigate("/Profil")}
        className="w-full -mb-[1000px] drop-shadow-xl shadow-black/10 bg-white dark:shadow-primary dark:bg-slate-900"
      >
        <CardHeader className="flex flex-row gap-4 items-center pb-2">
          <Avatar>
            <AvatarImage
              alt=""
              src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${email}${nom}`}
            />
            <AvatarFallback>Profil</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <CardTitle className="text-base">
              {nom === "" ? "Aucune personne connecter" : `${nom} ${prenom}`}
            </CardTitle>
            <CardDescription>{email}</CardDescription>
          </div>
        </CardHeader>
      </Card>
    </>
  );
}
