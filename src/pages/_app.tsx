import "@/styles/globals.css";
import type { AppProps } from "next/app";
import type { NextComponentType } from "next";
import Layout from "../components/Layout";
import { useUser } from "@/lib/hooks";
import { CurrentUserContext } from "@/components/Context";
import NextNProgress from "nextjs-progressbar";
import CircularProgress from "@mui/material/CircularProgress";
import ScrollToTop from "react-scroll-to-top";
import { useState } from "react";
import { pageBannerObj } from "@/lib/customTypes";

type customAppProps = AppProps & {
  Component: NextComponentType & { ditchLayout?: boolean };
};

export default function App({ Component, pageProps }: customAppProps) {
  var { user: currentUser, isLoading } = useUser();
  const [bannerContent, setBannerContent] = useState({
    icon: "home",
    text: "Home",
  });

  return Component.ditchLayout ? (
    <>
      <NextNProgress />
      <Component {...pageProps} user={currentUser} />
    </>
  ) : (
    <CurrentUserContext.Provider value={currentUser}>
      <Layout>
        {isLoading ? (
          <div className="h-full flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : (
          <>
            <NextNProgress options={{ showSpinner: false }} />
            <Component
              {...pageProps}
              setBannerContent={(content: pageBannerObj) =>
                setBannerContent(content)
              }
            />
            <ScrollToTop smooth />
          </>
        )}
      </Layout>
    </CurrentUserContext.Provider>
  );
}
