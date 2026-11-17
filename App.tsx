import { useEffect, useMemo, useState } from "react";
import { FlatList, KeyboardAvoidingView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { chargerTaches, sauvegarderTaches } from "./src/stockage";
import {
  ajouterTache,
  basculerTache,
  progression,
  supprimerTache,
  tachesDeLEchelle,
  trierTaches,
} from "./src/logique";
import { ECHELLES } from "./src/constantes";
import { useTheme } from "./src/theme";
import { Echelle, Tache } from "./src/types";
import { EnTete } from "./src/composants/EnTete";
import { SelecteurEchelle } from "./src/composants/SelecteurEchelle";
import { CarteTache } from "./src/composants/CarteTache";
import { FormulaireAjout } from "./src/composants/FormulaireAjout";
import { EtatVide } from "./src/composants/EtatVide";

export default function App() {
  const t = useTheme();
  const [taches, setTaches] = useState<Tache[]>([]);
  const [charge, setCharge] = useState(false);
  const [echelle, setEchelle] = useState<Echelle>("jour");
  const [titre, setTitre] = useState("");
  const [moment, setMoment] = useState<number | undefined>(undefined);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    chargerTaches().then((liste) => {
      setTaches(liste);
      setCharge(true);
    });
  }, []);

  useEffect(() => {
    if (charge) {
      sauvegarderTaches(taches);
    }
  }, [taches, charge]);

  const affichees = useMemo(
    () => trierTaches(tachesDeLEchelle(taches, echelle)),
    [taches, echelle]
  );
  const { faites, total } = progression(affichees);

  const compteurs = ECHELLES.reduce(
    (acc, e) => ({
      ...acc,
      [e]: tachesDeLEchelle(taches, e).filter((x) => !x.faite).length,
    }),
    {} as Record<Echelle, number>
  );

  function changerEchelle(e: Echelle) {
    setEchelle(e);
    setMoment(undefined);
  }

  function changerTitre(texte: string) {
    setTitre(texte);
    setErreur("");
  }

  function ajouter() {
    try {
      setTaches(ajouterTache(taches, titre, echelle, moment));
      setTitre("");
      setMoment(undefined);
      setErreur("");
    } catch (e) {
      setErreur((e as Error).message);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={[styles.page, { backgroundColor: t.fond }]}
    >
      <StatusBar style="auto" />
      <FlatList
        data={affichees}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <EnTete echelle={echelle} faites={faites} total={total} />
            <SelecteurEchelle valeur={echelle} onChange={changerEchelle} compteurs={compteurs} />
          </>
        }
        ListEmptyComponent={<EtatVide echelle={echelle} />}
        renderItem={({ item }) => (
          <CarteTache
            tache={item}
            onBasculer={() => setTaches(basculerTache(taches, item.id))}
            onSupprimer={() => setTaches(supprimerTache(taches, item.id))}
          />
        )}
      />
      <FormulaireAjout
        valeur={titre}
        onChange={changerTitre}
        onValider={ajouter}
        erreur={erreur}
        echelle={echelle}
        moment={moment}
        onMoment={setMoment}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, paddingTop: 56, paddingHorizontal: 20 },
});