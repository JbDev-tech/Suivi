import { Echelle, Tache } from "./types";

export function ajouterTache(
  taches: Tache[],
  titre: string,
  echelle: Echelle,
  moment?: number
): Tache[] {
  const titreNettoye = titre.trim();
  if (titreNettoye === "") {
    throw new Error("Le titre est vide");
  }
  const nouvelle: Tache = {
    id: Date.now().toString(),
    titre: titreNettoye,
    echelle,
    faite: false,
    creeLe: new Date().toISOString(),
    moment,
  };
  return [...taches, nouvelle];
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

export function basculerTache(taches: Tache[], id: string): Tache[] {
  return taches.map((t) => (t.id === id ? { ...t, faite: !t.faite } : t));
}

export function supprimerTache(taches: Tache[], id: string): Tache[] {
  return taches.filter((t) => t.id !== id);
}

export function tachesDeLEchelle(taches: Tache[], echelle: Echelle): Tache[] {
  return taches.filter((t) => t.echelle === echelle);
}



export function progression(taches: Tache[]): { faites: number; total: number } {
  return { faites: taches.filter((t) => t.faite).length, total: taches.length };
}