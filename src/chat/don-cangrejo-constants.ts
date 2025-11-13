/**
 * Constantes y tipos para Don Cangrejo
 * Archivo separado para cumplir con react-refresh/only-export-components
 */

export const DON_COLORS = {
  shell: "#E24A3B",
  shellDark: "#C93E31",
  highlight: "#EF6B5A",
  eye: "#1F2937",
  white: "#FFFFFF",
  wood: "#443314", // MUDECOOP
  sea: "#0D784A",  // acento
  sand: "#FBE8D2",
} as const;

export type DonMood = "happy" | "helpful" | "thinking" | "celebrate" | "warning" | "sleep";

export type DonCangrejoProps = {
  mood?: DonMood;
  size?: number;
  cap?: boolean;
  mustache?: boolean;
  title?: string;
  colors?: Partial<typeof DON_COLORS>;
  className?: string;
};