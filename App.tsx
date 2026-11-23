import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { chargerTaches, sauvegarderTaches } from "./src/stockage";
import {
  ajouterTache,
  basculerTache,
  modifierTache,
  progression,
  reporterTache,
  supprimerTache,
  tachesDeLaPeriode,
  trierTaches,
} from "./src/logique";
import { ECHELLES } from "./src/constantes";
import { clePeriode, clesDuJour, decalerPeriode, depuisCle } from "./src/dates";
import { useTheme } from "./src/theme";
import { Echelle, Tache } from "./src/types";
import { EnTete } from "./src/composants/EnTete";
import { SelecteurEchelle } from "./src/composants/SelecteurEchelle";
import { Calendrier } from "./src/composants/calendrier";
import { CarteTache } from "./src/composants/CarteTache";
import { FormulaireAjout } from "./src/composants/FormulaireAjout";
import { FenetreEdition } from "./src/composants/FenetreEdition";
import { EtatVide } from "./src/composants/EtatVide";

export default function App() {
  const t = useTheme();
  const [taches, setTaches] = useState<Tache[]>([]);
  const [charge, setCharge] = useState(false);
  const [echelle, setEchelle] = useState<Echelle>("jour");
  const [cles, setCles] = useState(clesDuJour);
  const [titre, setTitre] = useState("");
  const [moment, setMoment] = useState<number | undefined>(undefined);
  const [erreur, setErreur] = useState("");
  const [calendrierOuvert, setCalendrierOuvert] = useState(false);
  const [moisCal, setMoisCal] = useState(() => clePeriode("mois", new Date()));
  const [edition, setEdition] = useState<Tache | null>(null);

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

  const periode = cles[echelle];
  const estCourante = periode === clesDuJour()[echelle];

  const affichees = useMemo(
    () => trierTaches(tachesDeLaPeriode(taches, echelle, periode)),
    [taches, echelle, periode]
  );
  const { faites, total } = progression(affichees);

  const compteurs = ECHELLES.reduce(
    (acc, e) => ({
      ...acc,
      [e]: tachesDeLaPeriode(taches, e, cles[e]).filter((x) => !x.faite).length,
    }),
    {} as Record<Echelle, number>
  );

  const compteursJours = useMemo(() => {
    const resultat: Record<string, number> = {};
    for (const tache of taches) {
      if (tache.echelle === "jour") {
        resultat[tache.periode] = (resultat[tache.periode] ?? 0) + 1;
      }
    }
    return resultat;
  }, [taches]);

  function changerEchelle(e: Echelle) {
    setEchelle(e);
    setMoment(undefined);
  }

  function deplacer(pas: number) {
    setCles({ ...cles, [echelle]: decalerPeriode(echelle, periode, pas) });
  }

  function retourAujourdhui() {
    setCles({ ...cles, [echelle]: clesDuJour()[echelle] });
  }

  function basculerCalendrier() {
    if (!calendrierOuvert) {
      setMoisCal(clePeriode("mois", depuisCle(cles.jour)));
    }
    setCalendrierOuvert(!calendrierOuvert);
  }

  function choisirJour(cle: string) {
    setCles({ ...cles, jour: cle });
  }

  function changerTitre(texte: string) {
    setTitre(texte);
    setErreur("");
  }

  function ajouter() {
    try {
      setTaches(ajouterTache(taches, titre, echelle, periode, moment));
      setTitre("");
      setMoment(undefined);
      setErreur("");
    } catch (e) {
      setErreur((e as Error).message);
    }
  }

  function enregistrerEdition(nouveauTitre: string, nouveauMoment: number | undefined) {
    if (!edition) {
      return;
    }
    setTaches(
      modifierTache(taches, edition.id, { titre: nouveauTitre, moment: nouveauMoment })
    );
    setEdition(null);
  }

  function reporterEdition() {
    if (!edition) {
      return;
    }
    setTaches(reporterTache(taches, edition.id, 1));
    setEdition(null);
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
            <EnTete
              echelle={echelle}
              periode={periode}
              estCourante={estCourante}
              faites={faites}
              total={total}
              onPrecedent={() => deplacer(-1)}
              onSuivant={() => deplacer(1)}
              onRetour={retourAujourdhui}
            />
            <SelecteurEchelle valeur={echelle} onChange={changerEchelle} compteurs={compteurs} />
            {echelle === "jour" && (
              <>
                <Pressable onPress={basculerCalendrier} style={styles.boutonCalendrier}>
                  <Text style={[styles.texteCalendrier, { color: t.principal }]}>
                    {calendrierOuvert ? "Masquer le calendrier" : "Afficher le calendrier"}
                  </Text>
                </Pressable>
                {calendrierOuvert && (
                  <Calendrier
                    mois={moisCal}
                    selection={cles.jour}
                    aujourdhui={clesDuJour().jour}
                    compteurs={compteursJours}
                    onChoisir={choisirJour}
                    onMois={(pas) => setMoisCal(decalerPeriode("mois", moisCal, pas))}
                  />
                )}
              </>
            )}
          </>
        }
        ListEmptyComponent={<EtatVide echelle={echelle} />}
        renderItem={({ item }) => (
          <CarteTache
            tache={item}
            onBasculer={() => setTaches(basculerTache(taches, item.id))}
            onModifier={() => setEdition(item)}
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
      {edition && (
        <FenetreEdition
          key={edition.id}
          tache={edition}
          onFermer={() => setEdition(null)}
          onEnregistrer={enregistrerEdition}
          onReporter={reporterEdition}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, paddingTop: 56, paddingHorizontal: 20 },
  boutonCalendrier: { alignSelf: "flex-start", paddingVertical: 4, marginBottom: 12 },
  texteCalendrier: { fontSize: 14, fontWeight: "700" },
});