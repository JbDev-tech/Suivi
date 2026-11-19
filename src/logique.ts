import { clePeriode } from "./dates";
import { Echelle, Tache } from "./types";

export type TacheBrute = Omit<Tache, "periode"> & { periode?: string };

export function migrerTaches(brutes: TacheBrute[]): Tache[] {
  return brutes.map((t) => ({
    ...t,
    periode: t.periode ?? clePeriode(t.echelle, new Date(t.creeLe)),
  }));
}

export function ajouterTache(
  taches: Tache[],
  titre: string,
  echelle: Echelle,
  periode: string,
  moment?: number
): Tache[] {
  const titreNettoye = titre.trim();
  if (titreNettoye === "") {
    throw new Error("Le titre est vide");
  }
  if (titreNettoye.length > 100) {
    throw new Error("Le titre est trop long");
  }
  const nouvelle: Tache = {
    id: Date.now().toString(),
    titre: titreNettoye,
    echelle,
    periode,
    faite: false,
    creeLe: new Date().toISOString(),
    moment,
  };
  return [...taches, nouvelle];
}

export function basculerTache(taches: Tache[], id: string): Tache[] {
  return taches.map((t) => (t.id === id ? { ...t, faite: !t.faite } : t));
}

export function supprimerTache(taches: Tache[], id: string): Tache[] {
  return taches.filter((t) => t.id !== id);
}

export function tachesDeLaPeriode(
  taches: Tache[],
  echelle: Echelle,
  periode: string
): Tache[] {
  return taches.filter((t) => t.echelle === echelle && t.periode === periode);
}

export function trierTaches(taches: Tache[]): Tache[] {
  return [...taches].sort((a, b) => {
    if (a.faite !== b.faite) {
      return a.faite ? 1 : -1;
    }
    const ma = a.moment ?? Infinity;
    const mb = b.moment ?? Infinity;
    if (ma !== mb) {
      return ma - mb;
    }
    return a.creeLe.localeCompare(b.creeLe);
  });
}

export function progression(taches: Tache[]): { faites: number; total: number } {
  return { faites: taches.filter((t) => t.faite).length, total: taches.length };
}