import { useColorScheme } from "react-native";

const clair = {
  fond: "#F6F7FB",
  carte: "#FFFFFF",
  texte: "#14171F",
  texteDoux: "#6B7280",
  bordure: "#E5E7EB",
  principal: "#4F46E5",
  principalDoux: "#E8EAFF",
  succes: "#16A34A",
  danger: "#DC2626",
  surPrincipal: "#FFFFFF",
};

const sombre = {
  fond: "#0E1016",
  carte: "#1A1D27",
  texte: "#F3F4F6",
  texteDoux: "#9CA3AF",
  bordure: "#2B2F3C",
  principal: "#818CF8",
  principalDoux: "#232744",
  succes: "#22C55E",
  danger: "#F87171",
  surPrincipal: "#0E1016",
};

export type Theme = typeof clair;

export function useTheme(): Theme {
  const schema = useColorScheme();
  return schema === "dark" ? sombre : clair;
}

export const espace = { xs: 4, s: 8, m: 16, l: 24 };
export const rayon = { s: 10, m: 16, l: 26 };