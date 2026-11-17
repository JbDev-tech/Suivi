import { Pressable, StyleSheet, Text, View } from "react-native";
import { ECHELLES, LIBELLES_COURTS } from "../constantes";
import { rayon, useTheme } from "../theme";
import { Echelle } from "../types";

type Props = {
  valeur: Echelle;
  onChange: (e: Echelle) => void;
  compteurs: Record<Echelle, number>;
};

export function SelecteurEchelle({ valeur, onChange, compteurs }: Props) {
  const t = useTheme();

  return (
    <View style={[styles.conteneur, { backgroundColor: t.principalDoux }]}>
      {ECHELLES.map((e) => {
        const actif = e === valeur;
        return (
          <Pressable
            key={e}
            onPress={() => onChange(e)}
            style={[styles.onglet, actif && { backgroundColor: t.carte }, actif && styles.ombre]}
          >
            <Text
              style={[styles.libelle, { color: actif ? t.principal : t.texteDoux }]}
            >
              {LIBELLES_COURTS[e]}
            </Text>
            {compteurs[e] > 0 && (
              <View
                style={[
                  styles.pastille,
                  { backgroundColor: actif ? t.principal : t.texteDoux },
                ]}
              >
                <Text style={[styles.nombre, { color: t.surPrincipal }]}>{compteurs[e]}</Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: { flexDirection: "row", padding: 4, borderRadius: rayon.m, marginBottom: 16 },
  onglet: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: rayon.m - 4,
    gap: 6,
  },
  ombre: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  libelle: { fontSize: 14, fontWeight: "700" },
  pastille: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  nombre: { fontSize: 12, fontWeight: "700" },
});