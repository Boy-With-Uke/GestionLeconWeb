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
  classeFiliere: ClasseFiliere;
  classeMatiere: Matiere[];
};

export type Enseignant = {
  nom: string;
  prenom: string;
};

export type Lesson = {
  id_lecon: number;
  titre: string;
  contenue: string;
  typeLecon: string;
  matiereLesson: Matiere[];
};

export type ClasseMatiere = {
  classes: Classe;
};

export type Matiere = {
  id_matiere: number;
  nom: string;
  description: string;
  enseignant: Enseignant;
  lecon: Lesson[];
  classeMatiere: ClasseMatiere[];
};
