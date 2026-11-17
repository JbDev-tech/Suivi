import { Pressable, StyleSheet, Text, View } from "react-native";
import { libelleMoment } from "../constantes";
import { rayon, useTheme } from "../theme";
import { Tache } from "../types";

type Props = { tache: Tache; onBasculer: () => void; onSupprimer: () => void };

export function CarteTache({ tache, onBasculer, onSupprimer }: Props) {
  const t = useTheme();

  return (
    <View style={[styles.carte, styles.ombre, { backgroundColor: t.carte }]}>
      <Pressable
        onPress={onBasculer}
        style={({ pressed }) => [styles.principal, pressed && { opacity: 0.6 }]}
      >
        <View
          style={[
            styles.case,
            tache.faite
              ? { backgroundColor: t.succes, borderColor: t.succes }
              : { borderColor: t.bordure },
          ]}
        >
          {tache.faite && <Text style={[styles.coche, { color: t.surPrincipal }]}>✓</Text>}
        </View>
        <View style={styles.texte}>
          <Text
            style={[
              styles.titre,
              { color: tache.faite ? t.texteDoux : t.texte },
              tache.faite && styles.barre,
            ]}
          >
            {tache.titre}
          </Text>
          {tache.moment !== undefined && (
            <Text
              style={[styles.moment, { color: tache.faite ? t.texteDoux : t.principal }]}
            >
              {libelleMoment(tache.echelle, tache.moment)}
            </Text>
          )}
        </View>
      </Pressable>
      <Pressable onPress={onSupprimer} hitSlop={12}>
        <Text style={[styles.supprimer, { color: t.texteDoux }]}>✕</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  carte: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: rayon.m,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  ombre: {
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  principal: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12 },
  case: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  coche: { fontSize: 14, fontWeight: "800" },
  texte: { flex: 1 },
  titre: { fontSize: 16, fontWeight: "500" },
  moment: { fontSize: 12, fontWeight: "700", marginTop: 2 },
  barre: { textDecorationLine: "line-through" },
  supprimer: { fontSize: 16, paddingLeft: 12 },
});