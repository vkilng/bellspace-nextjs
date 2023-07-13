import { create } from "zustand";
import { PaletteMode } from "@mui/material";

type ThemeState = {
  theme: PaletteMode;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>()((set) => ({
  theme: "light",
  toggleTheme: () => {
    set((state) => {
      localStorage.setItem("theme", state.theme === "light" ? "dark" : "light");
      return { theme: state.theme === "light" ? "dark" : "light" };
    });
    document.querySelector("body")?.classList.toggle("dark");
  },
}));

type BannerContent = {
  icon: string;
  text: string;
  image?: any;
};

type BannerState = {
  bannerContent: BannerContent;
  setBannerContent: (content: BannerContent) => void;
  sidebarHidden: boolean;
  toggleSidebar: () => void;
};

export const useBannerStore = create<BannerState>()((set) => ({
  bannerContent: { icon: "home", text: "Home" },
  setBannerContent: (content: BannerContent) =>
    set(() => ({ bannerContent: content })),
  sidebarHidden: true,
  toggleSidebar: () =>
    set((state) => ({ sidebarHidden: !state.sidebarHidden })),
}));
