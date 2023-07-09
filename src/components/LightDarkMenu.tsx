import { useThemeStore } from "@/lib/store";
import IconButton from "@mui/material/IconButton";
import { Sun, MoonStars } from "@phosphor-icons/react";
import { useEffect } from "react";

export default function LightDarkMenu() {
  let { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    if (
      !localStorage.theme &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      console.log("... detecting theme: ", localStorage.theme);
      toggleTheme();
      return;
    } else if (localStorage.theme !== theme) {
      toggleTheme();
    }
  }, []);

  return (
    <div>
      <IconButton aria-label="theme-switcher" onClick={toggleTheme}>
        {theme === "light" ? (
          <Sun size={20} color="#6b7280" />
        ) : (
          <MoonStars size={20} color="#f8fafc" />
        )}
      </IconButton>
    </div>
  );
}
