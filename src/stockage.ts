import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tache } from "./types";

const CLE = "taches";

export async function chargerTaches(): Promise<Tache[]> {
  const brut = await AsyncStorage.getItem(CLE);
  return brut ? JSON.parse(brut) : [];
}

export async function sauvegarderTaches(taches: Tache[]): Promise<void> {
  await AsyncStorage.setItem(CLE, JSON.stringify(taches));
}