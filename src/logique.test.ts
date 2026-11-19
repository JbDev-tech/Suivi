import {
  ajouterTache,
  basculerTache,
  progression,
  supprimerTache,
  trierTaches,
} from "./logique";
import { Tache } from "./types";

function faireTache(surcharge: Partial<Tache> = {}): Tache {
  return {
    id: "1",
    titre: "Test",
    echelle: "jour",
    faite: false,
    creeLe: "2026-11-17T10:00:00.000Z",
    ...surcharge,
  };
}

describe("ajouterTache", () => {
  it("ajoute la tâche à la fin", () => {
    const base = [faireTache({ id: "a" })];
    const resultat = ajouterTache(base, "Lire", "semaine");
    expect(resultat).toHaveLength(2);
    expect(resultat[1].titre).toBe("Lire");
    expect(resultat[1].echelle).toBe("semaine");
    expect(resultat[1].faite).toBe(false);
  });

  it("ne modifie pas la liste d'origine", () => {
    const base = [faireTache({ id: "a" })];
    ajouterTache(base, "Lire", "jour");
    expect(base).toHaveLength(1);
  });

  it("nettoie les espaces du titre", () => {
    const resultat = ajouterTache([], "  Lire  ", "jour");
    expect(resultat[0].titre).toBe("Lire");
  });

  it("enregistre le moment", () => {
    const resultat = ajouterTache([], "Lire", "jour", 15);
    expect(resultat[0].moment).toBe(15);
  });

  it("refuse un titre vide ou fait d'espaces", () => {
    expect(() => ajouterTache([], "", "jour")).toThrow("Le titre est vide");
    expect(() => ajouterTache([], "   ", "jour")).toThrow("Le titre est vide");
  });

  it("refuse un titre de plus de 100 caractères", () => {
    expect(() => ajouterTache([], "a".repeat(101), "jour")).toThrow(
      "Le titre est trop long"
    );
  });

  it("accepte un titre d'exactement 100 caractères", () => {
    expect(() => ajouterTache([], "a".repeat(100), "jour")).not.toThrow();
  });

  it("mesure la longueur après nettoyage des espaces", () => {
    const titre = "  " + "a".repeat(100) + "  ";
    expect(() => ajouterTache([], titre, "jour")).not.toThrow();
  });
});

describe("basculerTache", () => {
  it("inverse l'état de la bonne tâche seulement", () => {
    const base = [faireTache({ id: "a" }), faireTache({ id: "b" })];
    const resultat = basculerTache(base, "a");
    expect(resultat[0].faite).toBe(true);
    expect(resultat[1].faite).toBe(false);
    expect(base[0].faite).toBe(false);
  });
});

describe("supprimerTache", () => {
  it("retire la tâche demandée", () => {
    const base = [faireTache({ id: "a" }), faireTache({ id: "b" })];
    const resultat = supprimerTache(base, "a");
    expect(resultat.map((t) => t.id)).toEqual(["b"]);
  });
});

describe("trierTaches", () => {
  it("met les tâches faites en dernier et ordonne par moment", () => {
    const a = faireTache({ id: "a", moment: 15 });
    const b = faireTache({ id: "b", moment: 9 });
    const c = faireTache({ id: "c" });
    const d = faireTache({ id: "d", moment: 8, faite: true });
    const resultat = trierTaches([c, d, a, b]).map((t) => t.id);
    expect(resultat).toEqual(["b", "a", "c", "d"]);
  });
});

describe("progression", () => {
  it("compte les tâches faites et le total", () => {
    const base = [faireTache({ faite: true }), faireTache({ id: "2" })];
    expect(progression(base)).toEqual({ faites: 1, total: 2 });
  });
});