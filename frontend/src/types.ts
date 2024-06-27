export type Filiere = {
  id_filiere: number;
  nomFiliere: string;
  nombreClasse: number;
};

export type User = {
  id_user: number;
  nom: string;
  prenom: string;
  email: string;
  niveauAccess: string;
};

export type ClasseFiliere = {
  nomFiliere: string;
};

export type Classe = {
  id_classe: number;
  nomClasse: string;
  classeMatiere: number;
  classeFiliere: ClasseFiliere;
};
export type enseignant = {
  nom: string;
  prenom: string;
};

export type Matiere = {
  id_matiere: number;
  nom: string;
  description: string;
  enseignant: enseignant;
  lecon: number;
  classMatiere: classeMatiere;
};

export type classeMatiere = {
  classes: classes;
};
export type classes = {
  nomClasse: string;
};
