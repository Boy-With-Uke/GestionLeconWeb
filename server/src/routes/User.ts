import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import { zValidator } from "@hono/zod-validator";
import { number, z } from "zod";

const prisma = new PrismaClient();

const userSchema = z.object({
  id_user: z.number(),
  nom: z.string(),
  prenom: z.string(),
  email: z.string(),
  classe: z.number(),
  niveauAccess: z.string(),
  motDePasse: z.string(),
});

const postUserSchema = z.object({
  nom: z.string(),
  prenom: z.string(),
  email: z.string(),
  classe: z.string(),
  motDePasse: z.string(),
});
const updateteUserSchema = userSchema.omit({
  id_user: true,
  motDePasse: true,
  niveauAccess: true,
});
const postUserFav = z.object({
  id_cours: z.number(),
});

const connexionUserSchema = postUserSchema.omit({
  nom: true,
  prenom: true,
  classe: true,
});
const updateUserPasswordSchema = userSchema
  .omit({
    id_user: true,
    nom: true,
    prenom: true,
    email: true,
    classe: true,
    niveauAccess: true,
  })
  .extend({
    newPassword: z.string?.(),
  });

export const userRoutes = new Hono()
  .get("/", async (c) => {
    const users = await prisma.user.findMany({
      select: {
        id_user: true,
        nom: true,
        prenom: true,
        email: true,
        motDePasse: true,
        niveauAccess: true,
        coursUtilisateur: true,
        classe: {
          select: {
            nomClasse: true,
            classeFiliere: {
              select: {
                nomFiliere: true,
              },
            },
          },
        }
      },
    });

    return c.json({ users });
  })
  .get("/:id{[0-9]+}", async (c) => {
    const userId = Number.parseInt(c.req.param("id"));
    try {
      const user = await prisma.user.findFirst({
        where: {
          id_user: userId,
        },
        select: {
          id_user: true,
          nom: true,
          prenom: true,
          email: true,
          niveauAccess: true,
          classe: {
            select: {
              nomClasse: true,
              classeFiliere: {
                select: {
                  nomFiliere: true,
                },
              },
            },
          },
        },
      });
      c.status(200);
      return c.json({ user });
    } catch (error) {
      c.status(500);
      return c.json({ Error: error });
    }
  })
  .post("/", zValidator("json", postUserSchema), async (c) => {
    const body = await c.req.valid("json");

    try {
      // Vérifier si l'email existe déjà
      const existingUser = await prisma.user.findUnique({
        where: {
          email: body.email,
        },
      });

      if (existingUser) {
        // Si l'email existe, renvoyer un statut 402 avec un message d'erreur
        c.status(401);
        return c.json({
          message: "L'email est deja liee a un compte",
        });
      }

      // Créer un nouvel utilisateur
      const newUser = await prisma.user.create({
        data: {
          nom: body.nom,
          prenom: body.prenom,
          email: body.email,
          motDePasse: body.motDePasse,
          classe: {
            connect: {
              nomClasse: body.classe,
            },
          },
        },
      });

      let message = "Nouvel utilisateur créé avec succès";
      c.status(200);
      return c.json({ message, newUser });
    } catch (error) {
      c.status(500);
      return c.json({ Error: error });
    }
  })
  .post("/connexion", zValidator("json", connexionUserSchema), async (c) => {
    const body = await c.req.valid("json");

    try {
      // Vérifier si l'email existe déjà
      const existingUser = await prisma.user.findUnique({
        where: {
          email: body.email,
          motDePasse: body.motDePasse,
        },
      });

      if (!existingUser) {
        // Si l'email existe, renvoyer un statut 402 avec un message d'erreur
        c.status(404);
        return c.json({
          message: "Aucun compte trouve veuillez verifier vos identifiants",
        });
      } else {
        let message = "Nouvel utilisateur créé avec succès";
        c.status(200);
        return c.json({ message, existingUser });
      }
    } catch (error) {
      c.status(500);
      return c.json({ Error: error });
    }
  })
  // .post("/fav/:id{[0-9]+}", zValidator("json", postUserFav), async (c) => {
  //   const userId = Number.parseInt(c.req.param("id"));
  //   const body = await c.req.valid("json");

  //   try {
  //     // Vérifier si l'email existe déjà
  //     const existingUser = await prisma.user.findUnique({
  //       where: {
  //         id_user: userId,
  //       },
  //     });
  //     const existingCourses = await prisma.cours.findUnique({
  //       where: {
  //         id_cours: body.id_cours,
  //       },
  //     });

  //     if (!existingUser) {
  //       // Si l'email existe, renvoyer un statut 402 avec un message d'erreur
  //       c.status(401);
  //       return c.json({
  //         message: "L'utilisateur n'existe pas",
  //       });
  //     }
  //     if (!existingCourses) {
  //       // Si l'email existe, renvoyer un statut 402 avec un message d'erreur
  //       c.status(401);
  //       return c.json({
  //         message: "Le cours n'existe pas",
  //       });
  //     }

  //     // Créer un nouvel utilisateur
  //     const newLink = await prisma.usersFav.create({
  //       data: {
  //         user: { connect: { id_user: existingUser.id_user } },
  //         courses: { connect: { id_cours: existingCourses.id_cours } },
  //       },
  //     });

  //     let message = "Nouvel favoris créé avec succès";
  //     c.status(200);
  //     return c.json({ message, newLink });
  //   } catch (error) {
  //     c.status(500);
  //     return c.json({ Error: error });
  //   }
  // })
  // .delete("/fav/:id{[0-9]+}", zValidator("json", postUserFav), async (c) => {
  //   const userId = Number.parseInt(c.req.param("id"));
  //   const body = await c.req.valid("json");

  //   try {
  //     // Vérifier si l'email existe déjà
  //     const existingUser = await prisma.user.findUnique({
  //       where: {
  //         id_user: userId,
  //       },
  //     });
  //     const existingCourses = await prisma.cours.findUnique({
  //       where: {
  //         id_cours: body.id_cours,
  //       },
  //     });

  //     if (!existingUser) {
  //       // Si l'email existe, renvoyer un statut 402 avec un message d'erreur
  //       c.status(401);
  //       return c.json({
  //         message: "L'utilisateur n'existe pas",
  //       });
  //     }
  //     if (!existingCourses) {
  //       // Si l'email existe, renvoyer un statut 402 avec un message d'erreur
  //       c.status(401);
  //       return c.json({
  //         message: "Le cours n'existe pas",
  //       });
  //     }

  //     // Créer un nouvel utilisateur
  //     const newLink = await prisma.usersFav.deleteMany({
  //       where: {
  //         userId: existingUser.id_user,
  //         coursId: existingCourses.id_cours,
  //       },
  //     });

  //     let message = "Nouvel favoris créé avec succès";
  //     c.status(200);
  //     return c.json({ message, newLink });
  //   } catch (error) {
  //     c.status(500);
  //     return c.json({ Error: error });
  //   }
  // })

  .delete("/:id{[0-9]+}", async (c) => {
    const userId = Number.parseInt(c.req.param("id"));

    try {
      const existingUser = await prisma.user.findFirst({
        where: {
          id_user: userId,
        },
      });

      let message;

      if (!existingUser) {
        message = `L'utilisateur avec l\'id: ${userId} n'existe pas`;
        c.status(404);
        return c.json({ message });
      } else {
        const deletedClasse = await prisma.user.delete({
          where: {
            id_user: userId,
          },
        });
        message = `L'utilisateur avec l\'id: ${userId} a été supprimé avec succès`;
        c.status(200);
        return c.json({ message, deletedClasse });
      }
    } catch (error) {
      c.status(500);
      return c.json({ Error: error });
    }
  })

  .put("/:id{[0-9]+}", zValidator("json", updateteUserSchema), async (c) => {
    const userId = Number.parseInt(c.req.param("id"));
    const body = await c.req.valid("json");
    try {
      const existingUser = await prisma.user.findFirst({
        where: {
          id_user: userId,
        },
      });
      const existingClasse = await prisma.classe.findFirst({
        where: {
          id_classe: body.classe,
        },
      });

      let message;

      if (!existingUser) {
        message = `L'utilisateur avec l\'id: ${userId} n'existe pas`;
        c.status(404);
        return c.json({ message });
      } else if (!existingClasse) {
        message = `Cette classe avec l\'id: ${body.classe} n'existe pas`;
        c.status(404);
        return c.json({ message });
      } else {
        const updatedUser = await prisma.user.update({
          where: {
            id_user: userId,
          },
          data: {
            nom: body.nom,
            prenom: body.prenom,
            email: body.email,
            classe: {
              connect: {
                id_classe: body.classe,
              },
            },
          },
        });
        message = `L'utilisateur avec l\'id: ${userId} a été supprimé avec succès`;
        c.status(200);
        return c.json({ message, updatedUser });
      }
    } catch (error) {
      c.status(500);
      return c.json({ Error: error });
    }
  })
  .put(
    "/updatePassword/:id{[0-9]+}",
    zValidator("json", updateUserPasswordSchema),
    async (c) => {
      const userId = Number.parseInt(c.req.param("id"));
      const body = await c.req.valid("json");
      try {
        const existingUser = await prisma.user.findFirst({
          where: {
            id_user: userId,
          },
          select: {
            motDePasse: true,
          },
        });
        let isValid;

        let message;
        if (body.motDePasse === existingUser?.motDePasse) {
          isValid = true;
        } else {
          isValid = false;
        }

        if (!existingUser) {
          message = `L'utilisateur avec l\'id: ${userId} n'existe pas`;
          c.status(404);
          return c.json({ message });
        } else {
          if (isValid) {
            const updatedUser = await prisma.user.update({
              where: {
                id_user: userId,
              },
              data: {
                motDePasse: body.newPassword,
              },
            });
            message = `Mise a jour du mot de passe'utilisateur avec l\'id: ${userId} est un succès`;
            c.status(200);
            return c.json({ message });
          } else {
            message = `Mot de passe incorrect`;
            c.status(401);
            return c.json({ message });
          }
        }
      } catch (error) {
        c.status(500);
        return c.json({ Error: error });
      }
    }
  )
  .put("/set/:fonction/:id{[0-9]+}", async (c) => {
    const userId = Number.parseInt(c.req.param("id"));
    const fonction = c.req.param("fonction").toUpperCase();
    try {
      const existingUser = await prisma.user.findFirst({
        where: {
          id_user: userId,
        },
      });

      let message;

      if (!existingUser) {
        message = `L'utilisateur avec l\'id: ${userId} n'existe pas`;
        c.status(404);
        return c.json({ message });
      } else {
        if (fonction === "ADMIN") {
          const updatedUser = await prisma.user.update({
            where: {
              id_user: userId,
            },
            data: {
              niveauAccess: "ADMIN",
            },
          });
          message = `Mise a niveau de l'acces de l'utilisateur en Admin succes`;
          c.status(200);
          return c.json({ message, updatedUser });
        } else if (fonction === "ENSEIGNANT") {
          const updatedUser = await prisma.user.update({
            where: {
              id_user: userId,
            },
            data: {
              niveauAccess: "ENSEIGNANT",
            },
          });
          message = `Mise a niveau de l'acces de l'utilisateur en Enseignant succes`;
          c.status(200);
          return c.json({ message, updatedUser });
        } else {
          const updatedUser = await prisma.user.update({
            where: {
              id_user: userId,
            },
            data: {
              niveauAccess: "USER",
            },
          });
          message = `Mise a niveau de l'acces de l'utilisateur en user succes`;
          c.status(200);
          return c.json({ message, updatedUser });
        }
      }
    } catch (error) {
      c.status(500);
      return c.json({ Error: error });
    }
  });
