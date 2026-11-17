import { Echelle } from "./types";

export const ECHELLES: Echelle[] = ["jour", "semaine", "mois"];

export const LIBELLES_COURTS: Record<Echelle, string> = {
  jour: "Jour",
  semaine: "Semaine",
  mois: "Mois",
};

export const LIBELLES_LONGS: Record<Echelle, string> = {
  jour: "Aujourd'hui",
  semaine: "Cette semaine",
  mois: "Ce mois-ci",
};

export const MESSAGES_VIDES: Record<Echelle, string> = {
  jour: "Rien de prévu aujourd'hui. Ajoute ta première tâche.",
  semaine: "Aucune tâche cette semaine. Prévois ce qui compte.",
  mois: "Aucune tâche ce mois-ci. Pense plus grand.",
};

export const JOURS_SEMAINE = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

export type OptionMoment = { valeur: number; libelle: string };

export const OPTIONS_MOMENT: Record<Echelle, OptionMoment[]> = {
  jour: Array.from({ length: 24 }, (_, h) => ({ valeur: h, libelle: `${h} h` })),
  semaine: JOURS_SEMAINE.map((nom, i) => ({ valeur: i + 1, libelle: nom.slice(0, 3) })),
  mois: [1, 2, 3, 4, 5].map((n) => ({ valeur: n, libelle: `S${n}` })),
};

export function libelleMoment(echelle: Echelle, moment: number): string {
  if (echelle === "jour") return `${moment} h`;
  if (echelle === "semaine") return JOURS_SEMAINE[moment - 1];
  return `Semaine ${moment}`;
}