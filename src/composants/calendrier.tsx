import { Pressable, StyleSheet, Text, View } from "react-native";
import { grilleDuMois, libellePeriode } from "../dates";
import { rayon, useTheme } from "../theme";

type Props = {
  mois: string;
  selection: string;
  aujourdhui: string;
  compteurs: Record<string, number>;
  onChoisir: (cle: string) => void;
  onMois: (pas: number) => void;
};

const INITIALES = ["L", "M", "M", "J", "V", "S", "D"];

export function Calendrier({
  mois,
  selection,
  aujourdhui,
  compteurs,
  onChoisir,
  onMois,
}: Props) {
  const t = useTheme();
  const libelle = libellePeriode("mois", mois);
  const titre = libelle.charAt(0).toUpperCase() + libelle.slice(1);

  return (
    <View style={[styles.carte, { backgroundColor: t.carte }]}>
      <View style={styles.entete}>
        <Text style={[styles.titre, { color: t.texte }]}>{titre}</Text>
        <View style={styles.fleches}>
          <Pressable
            onPress={() => onMois(-1)}
            hitSlop={12}
            style={[styles.fleche, { backgroundColor: t.principalDoux }]}
          >
            <Text style={[styles.symbole, { color: t.principal }]}>‹</Text>
          </Pressable>
          <Pressable
            onPress={() => onMois(1)}
            hitSlop={12}
            style={[styles.fleche, { backgroundColor: t.principalDoux }]}
          >
            <Text style={[styles.symbole, { color: t.principal }]}>›</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.ligne}>
        {INITIALES.map((lettre, i) => (
          <Text key={i} style={[styles.initiale, { color: t.texteDoux }]}>
            {lettre}
          </Text>
        ))}
      </View>

      {grilleDuMois(mois).map((semaine, i) => (
        <View key={i} style={styles.ligne}>
          {semaine.map((cellule, j) => {
            if (!cellule) {
              return <View key={j} style={styles.cellule} />;
            }
            const actif = cellule.cle === selection;
            const estAujourdhui = cellule.cle === aujourdhui;
            const nombre = Math.min(compteurs[cellule.cle] ?? 0, 3);
            return (
              <Pressable
                key={j}
                style={styles.cellule}
                onPress={() => onChoisir(cellule.cle)}
              >
                <View
                  style={[
                    styles.rond,
                    actif && { backgroundColor: t.principal },
                    !actif && estAujourdhui && { borderWidth: 2, borderColor: t.principal },
                  ]}
                >
                  <Text
                    style={[styles.numero, { color: actif ? t.surPrincipal : t.texte }]}
                  >
                    {cellule.numero}
                  </Text>
                </View>
                <View style={styles.points}>
                  {Array.from({ length: nombre }, (_, k) => (
                    <View key={k} style={[styles.point, { backgroundColor: t.principal }]} />
                  ))}
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  carte: { borderRadius: rayon.m, padding: 12, marginBottom: 16 },
  entete: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  titre: { fontSize: 18, fontWeight: "800" },
  fleches: { flexDirection: "row", gap: 8 },
  fleche: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  symbole: { fontSize: 22, lineHeight: 26, fontWeight: "700" },
  ligne: { flexDirection: "row" },
  initiale: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
  },
  cellule: { flex: 1, alignItems: "center", minHeight: 48, paddingVertical: 2 },
  rond: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  numero: { fontSize: 14, fontWeight: "600" },
  points: { flexDirection: "row", gap: 3, height: 6, marginTop: 2 },
  point: { width: 5, height: 5, borderRadius: 3 },
});