import { Echelle } from "./types";

const MOIS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

const JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

function deux(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function versCle(date: Date): string {
  return `${date.getFullYear()}-${deux(date.getMonth() + 1)}-${deux(date.getDate())}`;
}

export function depuisCle(cle: string): Date {
  const [annee, mois, jour] = cle.split("-").map(Number);
  return new Date(annee, mois - 1, jour || 1);
}

export function clePeriode(echelle: Echelle, date: Date): string {
  if (echelle === "jour") {
    return versCle(date);
  }
  if (echelle === "semaine") {
    const lundi = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    lundi.setDate(lundi.getDate() - ((lundi.getDay() + 6) % 7));
    return versCle(lundi);
  }
  return `${date.getFullYear()}-${deux(date.getMonth() + 1)}`;
}

export function decalerPeriode(echelle: Echelle, cle: string, pas: number): string {
  const d = depuisCle(cle);
  if (echelle === "jour") {
    d.setDate(d.getDate() + pas);
  } else if (echelle === "semaine") {
    d.setDate(d.getDate() + 7 * pas);
  } else {
    d.setMonth(d.getMonth() + pas);
  }
  return clePeriode(echelle, d);
}

export function libellePeriode(echelle: Echelle, cle: string): string {
  const d = depuisCle(cle);
  if (echelle === "jour") {
    return `${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]}`;
  }
  if (echelle === "semaine") {
    const fin = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 6);
    if (fin.getMonth() === d.getMonth()) {
      return `Du ${d.getDate()} au ${fin.getDate()} ${MOIS[d.getMonth()]}`;
    }
    return `Du ${d.getDate()} ${MOIS[d.getMonth()]} au ${fin.getDate()} ${MOIS[fin.getMonth()]}`;
  }
  return `${MOIS[d.getMonth()]} ${d.getFullYear()}`;
}
export function clesDuJour(date: Date = new Date()): Record<Echelle, string> {
  return {
    jour: clePeriode("jour", date),
    semaine: clePeriode("semaine", date),
    mois: clePeriode("mois", date),
  };
}
export type CelluleJour = { cle: string; numero: number } | null;

export function grilleDuMois(cleMois: string): CelluleJour[][] {
  const premier = depuisCle(cleMois);
  const annee = premier.getFullYear();
  const mois = premier.getMonth();
  const nbJours = new Date(annee, mois + 1, 0).getDate();
  const decalage = (premier.getDay() + 6) % 7;
  const cellules: CelluleJour[] = [];
  for (let i = 0; i < decalage; i++) {
    cellules.push(null);
  }
  for (let jour = 1; jour <= nbJours; jour++) {
    cellules.push({ cle: versCle(new Date(annee, mois, jour)), numero: jour });
  }
  while (cellules.length % 7 !== 0) {
    cellules.push(null);
  }
  const semaines: CelluleJour[][] = [];
  for (let i = 0; i < cellules.length; i += 7) {
    semaines.push(cellules.slice(i, i + 7));
  }
  return semaines;
}