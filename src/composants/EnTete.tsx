import { StyleSheet, Text, View } from "react-native";
import { LIBELLES_LONGS } from "../constantes";
import { espace, useTheme } from "../theme";
import { Echelle } from "../types";

type Props = { echelle: Echelle; faites: number; total: number };

export function EnTete({ echelle, faites, total }: Props) {
  const t = useTheme();
  const date = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const pourcentage = total === 0 ? 0 : Math.round((faites / total) * 100);

  return (
    <View style={styles.conteneur}>
      <Text style={[styles.date, { color: t.texteDoux }]}>{date}</Text>
      <Text style={[styles.titre, { color: t.texte }]}>{LIBELLES_LONGS[echelle]}</Text>
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
  date: { fontSize: 14, textTransform: "capitalize" },
  titre: { fontSize: 32, fontWeight: "800", marginBottom: espace.m },
  piste: { height: 8, borderRadius: 4, overflow: "hidden" },
  barre: { height: 8, borderRadius: 4 },
  resume: { fontSize: 13, marginTop: espace.s },
});