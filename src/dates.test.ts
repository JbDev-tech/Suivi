import {
  clePeriode,
  clesDuJour,
  decalerPeriode,
  depuisCle,
  grilleDuMois,
  libellePeriode,
  versCle,
} from "./dates";
describe("clePeriode", () => {
  it("renvoie le jour exact", () => {
    expect(clePeriode("jour", new Date(2026, 10, 19))).toBe("2026-11-19");
  });

  it("renvoie le lundi de la semaine", () => {
    expect(clePeriode("semaine", new Date(2026, 10, 19))).toBe("2026-11-16");
    expect(clePeriode("semaine", new Date(2026, 10, 22))).toBe("2026-11-16");
    expect(clePeriode("semaine", new Date(2026, 10, 23))).toBe("2026-11-23");
  });

  it("renvoie le mois", () => {
    expect(clePeriode("mois", new Date(2026, 10, 19))).toBe("2026-11");
  });
});

describe("decalerPeriode", () => {
  it("décale les jours en changeant de mois", () => {
    expect(decalerPeriode("jour", "2026-11-30", 1)).toBe("2026-12-01");
    expect(decalerPeriode("jour", "2026-11-01", -1)).toBe("2026-10-31");
  });

  it("décale les semaines en changeant d'année", () => {
    expect(decalerPeriode("semaine", "2026-11-16", 1)).toBe("2026-11-23");
    expect(decalerPeriode("semaine", "2026-12-28", 1)).toBe("2027-01-04");
  });

  it("décale les mois en changeant d'année", () => {
    expect(decalerPeriode("mois", "2026-12", 1)).toBe("2027-01");
    expect(decalerPeriode("mois", "2026-01", -1)).toBe("2025-12");
  });
});

describe("libellePeriode", () => {
  it("décrit un jour", () => {
    expect(libellePeriode("jour", "2026-11-19")).toBe("jeudi 19 novembre");
  });

  it("décrit une semaine dans un même mois ou à cheval", () => {
    expect(libellePeriode("semaine", "2026-11-16")).toBe("Du 16 au 22 novembre");
    expect(libellePeriode("semaine", "2026-11-30")).toBe("Du 30 novembre au 6 décembre");
  });

  it("décrit un mois", () => {
    expect(libellePeriode("mois", "2026-11")).toBe("novembre 2026");
  });
});

describe("versCle et depuisCle", () => {
  it("se répondent l'un à l'autre", () => {
    expect(versCle(depuisCle("2026-02-07"))).toBe("2026-02-07");
  });
});

describe("clesDuJour", () => {
  it("donne les trois périodes d'une date", () => {
    expect(clesDuJour(new Date(2026, 10, 19))).toEqual({
      jour: "2026-11-19",
      semaine: "2026-11-16",
      mois: "2026-11",
    });
  });
});

describe("grilleDuMois", () => {
  it("place le 1er novembre 2026 un dimanche", () => {
    const grille = grilleDuMois("2026-11");
    expect(grille).toHaveLength(6);
    expect(grille[0].slice(0, 6)).toEqual([null, null, null, null, null, null]);
    expect(grille[0][6]).toEqual({ cle: "2026-11-01", numero: 1 });
    expect(grille[5][0]).toEqual({ cle: "2026-11-30", numero: 30 });
  });

  it("n'ajoute aucune ligne en trop pour février 2027", () => {
    const grille = grilleDuMois("2027-02");
    expect(grille).toHaveLength(4);
    expect(grille[0][0]).toEqual({ cle: "2027-02-01", numero: 1 });
    expect(grille[3][6]).toEqual({ cle: "2027-02-28", numero: 28 });
  });
});