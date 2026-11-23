import {
  ajouterTache,
  basculerTache,
  migrerTaches,
  modifierTache,
  progression,
  reporterTache,
  supprimerTache,
  tachesDeLaPeriode,
  TacheBrute,
  trierTaches,
} from "./logique";
import { Tache } from "./types";

function faireTache(surcharge: Partial<Tache> = {}): Tache {
  return {
    id: "1",
    titre: "Test",
    echelle: "jour",
    periode: "2026-11-17",
    faite: false,
    creeLe: "2026-11-17T10:00:00.000Z",
    ...surcharge,
  };
}

describe("ajouterTache", () => {
  it("ajoute la tâche à la fin", () => {
    const base = [faireTache({ id: "a" })];
    const resultat = ajouterTache(base, "Lire", "semaine", "2026-11-16");
    expect(resultat).toHaveLength(2);
    expect(resultat[1].titre).toBe("Lire");
    expect(resultat[1].echelle).toBe("semaine");
    expect(resultat[1].faite).toBe(false);
  });

  it("ne modifie pas la liste d'origine", () => {
    const base = [faireTache({ id: "a" })];
    ajouterTache(base, "Lire", "jour", "2026-11-17");
    expect(base).toHaveLength(1);
  });

  it("nettoie les espaces du titre", () => {
    const resultat = ajouterTache([], "  Lire  ", "jour", "2026-11-17");
    expect(resultat[0].titre).toBe("Lire");
  });

  it("enregistre le moment", () => {
    const resultat = ajouterTache([], "Lire", "jour", "2026-11-17", 15);
    expect(resultat[0].moment).toBe(15);
  });

  it("enregistre la période", () => {
    const resultat = ajouterTache([], "Lire", "mois", "2026-12");
    expect(resultat[0].periode).toBe("2026-12");
  });

  it("refuse un titre vide ou fait d'espaces", () => {
    expect(() => ajouterTache([], "", "jour", "2026-11-17")).toThrow("Le titre est vide");
    expect(() => ajouterTache([], "   ", "jour", "2026-11-17")).toThrow("Le titre est vide");
  });

  it("refuse un titre de plus de 100 caractères", () => {
    expect(() => ajouterTache([], "a".repeat(101), "jour", "2026-11-17")).toThrow(
      "Le titre est trop long"
    );
  });

  it("accepte un titre d'exactement 100 caractères", () => {
    expect(() => ajouterTache([], "a".repeat(100), "jour", "2026-11-17")).not.toThrow();
  });

  it("mesure la longueur après nettoyage des espaces", () => {
    const titre = "  " + "a".repeat(100) + "  ";
    expect(() => ajouterTache([], titre, "jour", "2026-11-17")).not.toThrow();
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

describe("tachesDeLaPeriode", () => {
  it("garde seulement l'échelle et la période demandées", () => {
    const a = faireTache({ id: "a" });
    const b = faireTache({ id: "b", periode: "2026-11-18" });
    const c = faireTache({ id: "c", echelle: "semaine", periode: "2026-11-16" });
    const resultat = tachesDeLaPeriode([a, b, c], "jour", "2026-11-17");
    expect(resultat.map((t) => t.id)).toEqual(["a"]);
  });
});

describe("migrerTaches", () => {
  it("donne à une ancienne tâche la période de sa date de création", () => {
    const ancienne: TacheBrute = {
      id: "1",
      titre: "Ancienne",
      echelle: "semaine",
      faite: false,
      creeLe: "2026-11-19T12:00:00.000Z",
    };
    expect(migrerTaches([ancienne])[0].periode).toBe("2026-11-16");
    expect(migrerTaches([{ ...ancienne, echelle: "mois" }])[0].periode).toBe("2026-11");
  });

  it("garde la période d'une tâche qui en a déjà une", () => {
    const recente: TacheBrute = {
      id: "1",
      titre: "Récente",
      echelle: "jour",
      periode: "2026-12-25",
      faite: false,
      creeLe: "2026-11-19T12:00:00.000Z",
    };
    expect(migrerTaches([recente])[0].periode).toBe("2026-12-25");
  });
});

describe("basculerTache et date de réalisation", () => {
  it("enregistre la date quand on coche", () => {
    const base = [faireTache({ id: "a" })];
    const resultat = basculerTache(base, "a", new Date("2026-11-20T09:00:00.000Z"));
    expect(resultat[0].faite).toBe(true);
    expect(resultat[0].faiteLe).toBe("2026-11-20T09:00:00.000Z");
  });

  it("efface la date quand on décoche", () => {
    const base = [
      faireTache({ id: "a", faite: true, faiteLe: "2026-11-20T09:00:00.000Z" }),
    ];
    const resultat = basculerTache(base, "a");
    expect(resultat[0].faite).toBe(false);
    expect(resultat[0].faiteLe).toBeUndefined();
  });
});

describe("modifierTache", () => {
  it("change le titre nettoyé et le moment", () => {
    const base = [faireTache({ id: "a", moment: 9 })];
    const resultat = modifierTache(base, "a", { titre: "  Nouveau  ", moment: 15 });
    expect(resultat[0].titre).toBe("Nouveau");
    expect(resultat[0].moment).toBe(15);
  });

  it("refuse un titre vide", () => {
    const base = [faireTache({ id: "a" })];
    expect(() => modifierTache(base, "a", { titre: "   " })).toThrow("Le titre est vide");
  });

  it("refuse un titre trop long", () => {
    const base = [faireTache({ id: "a" })];
    expect(() => modifierTache(base, "a", { titre: "a".repeat(101) })).toThrow(
      "Le titre est trop long"
    );
  });

  it("ne touche ni la liste d'origine ni les autres tâches", () => {
    const base = [faireTache({ id: "a" }), faireTache({ id: "b", titre: "Autre" })];
    const resultat = modifierTache(base, "a", { titre: "Changé" });
    expect(base[0].titre).toBe("Test");
    expect(resultat[1].titre).toBe("Autre");
  });
});

describe("reporterTache", () => {
  it("reporte un jour au lendemain en gardant l'heure", () => {
    const base = [faireTache({ id: "a", periode: "2026-11-30", moment: 15 })];
    const resultat = reporterTache(base, "a", 1);
    expect(resultat[0].periode).toBe("2026-12-01");
    expect(resultat[0].moment).toBe(15);
  });

  it("reporte une semaine à la suivante", () => {
    const base = [
      faireTache({ id: "a", echelle: "semaine", periode: "2026-12-28", moment: 3 }),
    ];
    const resultat = reporterTache(base, "a", 1);
    expect(resultat[0].periode).toBe("2027-01-04");
    expect(resultat[0].moment).toBe(3);
  });

  it("reporte un mois au suivant et efface la semaine", () => {
    const base = [
      faireTache({ id: "a", echelle: "mois", periode: "2026-12", moment: 5 }),
    ];
    const resultat = reporterTache(base, "a", 1);
    expect(resultat[0].periode).toBe("2027-01");
    expect(resultat[0].moment).toBeUndefined();
  });
});