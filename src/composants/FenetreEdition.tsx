import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { LIBELLES_REPORT } from "../constantes";
import { rayon, useTheme } from "../theme";
import { Tache } from "../types";
import { SelecteurMoment } from "./SelecteurMoment";

type Props = {
  tache: Tache;
  onFermer: () => void;
  onEnregistrer: (titre: string, moment: number | undefined) => void;
  onReporter: () => void;
};

export function FenetreEdition({ tache, onFermer, onEnregistrer, onReporter }: Props) {
  const t = useTheme();
  const [titre, setTitre] = useState(tache.titre);
  const [moment, setMoment] = useState<number | undefined>(tache.moment);
  const [erreur, setErreur] = useState("");

  function valider() {
    try {
      onEnregistrer(titre, moment);
    } catch (e) {
      setErreur((e as Error).message);
    }
  }

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onFermer}>
      <KeyboardAvoidingView behavior="padding" style={styles.fond}>
        <Pressable style={styles.zoneFermeture} onPress={onFermer} />
        <View style={[styles.feuille, { backgroundColor: t.fond }]}>
          <Text style={[styles.titre, { color: t.texte }]}>Modifier la tâche</Text>
          {erreur !== "" && <Text style={[styles.erreur, { color: t.danger }]}>{erreur}</Text>}
          <TextInput
            style={[
              styles.champ,
              {
                backgroundColor: t.carte,
                borderColor: erreur !== "" ? t.danger : t.bordure,
                color: t.texte,
              },
            ]}
            value={titre}
            onChangeText={(texte) => {
              setTitre(texte);
              setErreur("");
            }}
            placeholder="Titre de la tâche"
            placeholderTextColor={t.texteDoux}
            returnKeyType="done"
            onSubmitEditing={valider}
          />
          <SelecteurMoment echelle={tache.echelle} valeur={moment} onChange={setMoment} />
          <Pressable
            onPress={onReporter}
            style={[styles.reporter, { backgroundColor: t.principalDoux }]}
          >
            <Text style={[styles.texteReporter, { color: t.principal }]}>
              {LIBELLES_REPORT[tache.echelle]}
            </Text>
          </Pressable>
          <View style={styles.actions}>
            <Pressable
              onPress={onFermer}
              style={[
                styles.bouton,
                { backgroundColor: t.carte, borderColor: t.bordure, borderWidth: 1 },
              ]}
            >
              <Text style={[styles.texteBouton, { color: t.texte }]}>Annuler</Text>
            </Pressable>
            <Pressable
              onPress={valider}
              style={[styles.bouton, { backgroundColor: t.principal }]}
            >
              <Text style={[styles.texteBouton, { color: t.surPrincipal }]}>Enregistrer</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fond: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.45)" },
  zoneFermeture: { flex: 1 },
  feuille: {
    borderTopLeftRadius: rayon.l,
    borderTopRightRadius: rayon.l,
    padding: 20,
    paddingBottom: 28,
  },
  titre: { fontSize: 20, fontWeight: "800", marginBottom: 14 },
  erreur: { fontSize: 13, marginBottom: 6, marginLeft: 4 },
  champ: {
    height: 52,
    borderWidth: 1,
    borderRadius: rayon.l,
    paddingHorizontal: 18,
    fontSize: 16,
    marginBottom: 12,
  },
  reporter: {
    borderRadius: rayon.m,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  texteReporter: { fontSize: 15, fontWeight: "700" },
  actions: { flexDirection: "row", gap: 10 },
  bouton: { flex: 1, borderRadius: rayon.l, paddingVertical: 14, alignItems: "center" },
  texteBouton: { fontSize: 16, fontWeight: "700" },
});