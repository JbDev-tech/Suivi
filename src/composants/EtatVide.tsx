import { StyleSheet, Text, View } from "react-native";
import { MESSAGES_VIDES } from "../constantes";
import { useTheme } from "../theme";
import { Echelle } from "../types";

export function EtatVide({ echelle }: { echelle: Echelle }) {
  const t = useTheme();

  return (
    <View style={styles.conteneur}>
      <Text style={styles.icone}>🗒️</Text>
      <Text style={[styles.message, { color: t.texteDoux }]}>{MESSAGES_VIDES[echelle]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: { alignItems: "center", paddingVertical: 48, paddingHorizontal: 24 },
  icone: { fontSize: 48, marginBottom: 12 },
  message: { fontSize: 15, textAlign: "center", lineHeight: 22 },
});