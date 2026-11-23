import { clePeriode, decalerPeriode } from "./dates";
import { Echelle, Tache } from "./types";

export type TacheBrute = Omit<Tache, "periode"> & { periode?: string };

export function migrerTaches(brutes: TacheBrute[]): Tache[] {
  return brutes.map((t) => ({
    ...t,
    periode: t.periode ?? clePeriode(t.echelle, new Date(t.creeLe)),
  }));
}

function nettoyerTitre(titre: string): string {
  const nettoye = titre.trim();
  if (nettoye === "") {
    throw new Error("Le titre est vide");
  }
  if (nettoye.length > 100) {
    throw new Error("Le titre est trop long");
  }
  return nettoye;
}

export function ajouterTache(
  taches: Tache[],
  titre: string,
  echelle: Echelle,
  periode: string,
  moment?: number
): Tache[] {
  const nouvelle: Tache = {
    id: Date.now().toString(),
    titre: nettoyerTitre(titre),
    echelle,
    periode,
    faite: false,
    creeLe: new Date().toISOString(),
    moment,
  };
  return [...taches, nouvelle];
}

export function basculerTache(
  taches: Tache[],
  id: string,
  maintenant: Date = new Date()
): Tache[] {
  return taches.map((t) => {
    if (t.id !== id) {
      return t;
    }
    if (t.faite) {
      return { ...t, faite: false, faiteLe: undefined };
    }
    return { ...t, faite: true, faiteLe: maintenant.toISOString() };
  });
}

export function modifierTache(
  taches: Tache[],
  id: string,
  champs: { titre: string; moment?: number }
): Tache[] {
  const titre = nettoyerTitre(champs.titre);
  return taches.map((t) =>
    t.id === id ? { ...t, titre, moment: champs.moment } : t
  );
}

export function reporterTache(taches: Tache[], id: string, pas: number): Tache[] {
  return taches.map((t) =>
    t.id === id
      ? {
          ...t,
          periode: decalerPeriode(t.echelle, t.periode, pas),
          moment: t.echelle === "mois" ? undefined : t.moment,
        }
      : t
  );
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