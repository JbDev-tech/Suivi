import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { rayon, useTheme } from "../theme";
import { Echelle } from "../types";
import { SelecteurMoment } from "./SelecteurMoment";

type Props = {
  valeur: string;
  onChange: (texte: string) => void;
  onValider: () => void;
  erreur: string;
  echelle: Echelle;
  moment: number | undefined;
  onMoment: (moment: number | undefined) => void;
};

export function FormulaireAjout({
  valeur,
  onChange,
  onValider,
  erreur,
  echelle,
  moment,
  onMoment,
}: Props) {
  const t = useTheme();

  return (
    <View style={styles.conteneur}>
      <SelecteurMoment echelle={echelle} valeur={moment} onChange={onMoment} />
      {erreur !== "" && <Text style={[styles.erreur, { color: t.danger }]}>{erreur}</Text>}
      <View style={styles.ligne}>
        <TextInput
          style={[
            styles.champ,
            {
              backgroundColor: t.carte,
              borderColor: erreur !== "" ? t.danger : t.bordure,
              color: t.texte,
            },
          ]}
          value={valeur}
          onChangeText={onChange}
          placeholder="Ajouter une tâche..."
          placeholderTextColor={t.texteDoux}
          returnKeyType="done"
          onSubmitEditing={onValider}
        />
        <Pressable
          onPress={onValider}
          style={({ pressed }) => [
            styles.bouton,
            { backgroundColor: t.principal },
            pressed && { opacity: 0.8 },
          ]}
        >
          <Text style={[styles.plus, { color: t.surPrincipal }]}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: { paddingTop: 8, paddingBottom: 24 },
  ligne: { flexDirection: "row", gap: 10 },
  champ: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderRadius: rayon.l,
    paddingHorizontal: 18,
    fontSize: 16,
  },
  bouton: { width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center" },
  plus: { fontSize: 28, lineHeight: 30 },
  erreur: { fontSize: 13, marginBottom: 6, marginLeft: 6 },
});