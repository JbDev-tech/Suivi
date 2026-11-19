import AsyncStorage from "@react-native-async-storage/async-storage";
import { migrerTaches, TacheBrute } from "./logique";
import { Tache } from "./types";

const CLE = "taches";

export async function chargerTaches(): Promise<Tache[]> {
  const brut = await AsyncStorage.getItem(CLE);
  if (!brut) {
    return [];
  }
  return migrerTaches(JSON.parse(brut) as TacheBrute[]);
}

export async function sauvegarderTaches(taches: Tache[]): Promise<void> {
  await AsyncStorage.setItem(CLE, JSON.stringify(taches));
}