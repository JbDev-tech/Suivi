import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { OPTIONS_MOMENT } from "../constantes";
import { rayon, useTheme } from "../theme";
import { Echelle } from "../types";

type Props = {
  echelle: Echelle;
  valeur: number | undefined;
  onChange: (moment: number | undefined) => void;
};

export function SelecteurMoment({ echelle, valeur, onChange }: Props) {
  const t = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      style={styles.conteneur}
      contentContainerStyle={styles.ligne}
    >
      {OPTIONS_MOMENT[echelle].map((o) => {
        const actif = o.valeur === valeur;
        return (
          <Pressable
            key={o.valeur}
            onPress={() => onChange(actif ? undefined : o.valeur)}
            style={[
              styles.puce,
              {
                backgroundColor: actif ? t.principal : t.carte,
                borderColor: actif ? t.principal : t.bordure,
              },
            ]}
          >
            <Text
              style={[styles.libelle, { color: actif ? t.surPrincipal : t.texteDoux }]}
            >
              {o.libelle}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  conteneur: { flexGrow: 0, marginBottom: 10 },
  ligne: { gap: 8, paddingRight: 8 },
  puce: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: rayon.l,
    borderWidth: 1,
  },
  libelle: { fontSize: 14, fontWeight: "600" },
});