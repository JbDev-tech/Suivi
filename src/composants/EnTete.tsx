import { Pressable, StyleSheet, Text, View } from "react-native";
import { libellePeriode } from "../dates";
import { espace, useTheme } from "../theme";
import { Echelle } from "../types";

type Props = {
  echelle: Echelle;
  periode: string;
  estCourante: boolean;
  faites: number;
  total: number;
  onPrecedent: () => void;
  onSuivant: () => void;
  onRetour: () => void;
};

export function EnTete({
  echelle,
  periode,
  estCourante,
  faites,
  total,
  onPrecedent,
  onSuivant,
  onRetour,
}: Props) {
  const t = useTheme();
  const libelle = libellePeriode(echelle, periode);
  const titre = libelle.charAt(0).toUpperCase() + libelle.slice(1);
  const pourcentage = total === 0 ? 0 : Math.round((faites / total) * 100);

  return (
    <View style={styles.conteneur}>
      <View style={styles.navigation}>
        <Pressable
          onPress={onPrecedent}
          hitSlop={12}
          style={[styles.fleche, { backgroundColor: t.principalDoux }]}
        >
          <Text style={[styles.symbole, { color: t.principal }]}>‹</Text>
        </Pressable>
        <View style={styles.centre}>
          <Text style={[styles.titre, { color: t.texte }]} numberOfLines={2}>
            {titre}
          </Text>
          {!estCourante && (
            <Pressable onPress={onRetour} hitSlop={8}>
              <Text style={[styles.retour, { color: t.principal }]}>
                Revenir à aujourd'hui
              </Text>
            </Pressable>
          )}
        </View>
        <Pressable
          onPress={onSuivant}
          hitSlop={12}
          style={[styles.fleche, { backgroundColor: t.principalDoux }]}
        >
          <Text style={[styles.symbole, { color: t.principal }]}>›</Text>
        </Pressable>
      </View>
      <View style={[styles.piste, { backgroundColor: t.principalDoux }]}>
        <View
          style={[styles.barre, { backgroundColor: t.principal, width: `${pourcentage}%` }]}
        />
      </View>
      <Text style={[styles.resume, { color: t.texteDoux }]}>
        {total === 0
          ? "Aucune tâche"
          : `${faites} sur ${total} terminée${faites > 1 ? "s" : ""} · ${pourcentage} %`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: { marginBottom: espace.m },
  navigation: {
    flexDirection: "row",
    alignItems: "center",
    gap: espace.s,
    marginBottom: espace.m,
  },
  fleche: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  symbole: { fontSize: 26, lineHeight: 30, fontWeight: "700" },
  centre: { flex: 1, alignItems: "center" },
  titre: { fontSize: 22, fontWeight: "800", textAlign: "center" },
  retour: { fontSize: 13, fontWeight: "600", marginTop: 4 },
  piste: { height: 8, borderRadius: 4, overflow: "hidden" },
  barre: { height: 8, borderRadius: 4 },
  resume: { fontSize: 13, marginTop: espace.s },
});