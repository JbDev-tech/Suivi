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