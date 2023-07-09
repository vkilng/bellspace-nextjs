import Header from "./Header";
import Sidebar from "./Sidebar";
import Head from "next/head";
import {
  createTheme,
  ThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles";
import { PropsWithChildren } from "react";
import ScrollToTop from "./ScrollToTop";
import { useBannerStore, useThemeStore } from "@/lib/store";

export default function Layout({ children }: PropsWithChildren) {
  const mode = useThemeStore((state) => state.theme);
  const myTheme = createTheme({
    palette: {
      divider: "#a1a1aa",
      primary: {
        main: "#2dd4bf",
        contrastText: "#fff",
      },
      secondary: {
        main: "#78716c",
        contrastText: "#fff",
      },
      error: {
        main: "#dc2626",
      },
      info: {
        main: "#0c0a09",
      },
      success: {
        main: "#84cc16",
      },
      mode: mode,
    },
  });

  const sidebarHidden = useBannerStore((state) => state.sidebarHidden);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={myTheme}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
          <link
            rel="shortcut icon"
            href="/images/turbine-icon.png"
            type="image/x-icon"
          />
          <title>Bellspace</title>
        </Head>
        <div
          className={`h-full font-sans grid grid-rows-[min-content_1fr] grid-cols-1 ${
            sidebarHidden ? "" : "md:grid-cols-[1fr_3.5fr]"
          }`}
          key="nochange"
        >
          <div className="z-20 col-span-3 h-min shadow-sm dark:bg-black dark:shadow-sm dark:shadow-zinc-900">
            <Header />
          </div>
          <div
            className={`overflow-y-hidden hidden ${
              sidebarHidden ? "" : "md:block"
            } dark:bg-black dark:text-white`}
          >
            <Sidebar />
          </div>
          <div className="overflow-y-hidden h-full bg-slate-100 dark:bg-zinc-950">
            {children}
            <ScrollToTop />
          </div>
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

// const getDesignTokens = (mode: PaletteMode) => ({
//   palette: {
//     mode,
//     ...(mode === "light"
//       ? {
//           primary: {
//             main: "#2dd4bf",
//             contrastText: "#ffffff",
//           },
//           secondary: {
//             main: "#000000",
//             contrastText: "#ffffff",
//           },
//           error: {
//             main: "#dc2626",
//           },
//           info: {
//             main: "#0c0a09",
//           },
//           success: {
//             main: "#84cc16",
//           },
//         }
//       : {
//           primary: {
//             main: "#2dd4bf",
//             contrastText: "#ffffff",
//           },
//           secondary: {
//             main: "##1e293b",
//             contrastText: "#ffffff",
//           },
//           error: {
//             main: "#dc2626",
//           },
//           info: {
//             main: "#0c0a09",
//           },
//           success: {
//             main: "#84cc16",
//           },
//           divider: "#64748b",
//         }),
//   },
// });
