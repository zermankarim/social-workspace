import { create } from "zustand";
import { persist } from "zustand/middleware";
import { THEME_STORAGE_KEY } from "@/presentation/lib/theme-storage";

export type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "light",
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set({ theme: get().theme === "light" ? "dark" : "light" }),
    }),
    { name: THEME_STORAGE_KEY },
  ),
);
