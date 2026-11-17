export type Echelle = "jour" | "semaine" | "mois";

export type Tache = {
  id: string;
  titre: string;
  echelle: Echelle;
  faite: boolean;
  creeLe: string;
  moment?: number;
};