import Header from "./Header";
import Sidebar from "./Sidebar";
import Head from "next/head";
import { PageBannerContext } from "./Context";
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';

const myTheme = createTheme({
  palette: {
    primary: {
      main: '#2dd4bf',
      contrastText: '#fff'
    },
    secondary: {
      main: '#78716c',
      contrastText: '#fff'
    },
    error: {
      main: '#dc2626'
    },
    info: {
      main: '#0c0a09'
    },
    success: {
      main: '#84cc16'
    },
    // mode: 'light',
  }
})

export default function Layout({ children }) {

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={myTheme}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
          <link rel="shortcut icon" href="/images/turbine-icon.png" type="image/x-icon" />
          <title>Bellspace</title>
        </Head>
        <div className="grid h-full grid-rows-[min-content_1fr] grid-cols-1 md:grid-cols-[1fr_3.5fr]">
          <div className="z-20 col-span-3 h-min shadow-lg">
            <PageBannerContext.Provider value={bannerContent}>
              <Header></Header>
            </PageBannerContext.Provider>
          </div>
          <div className="overflow-y-hidden hidden md:block">
            <Sidebar />
          </div>
          <div className="overflow-y-hidden h-full bg-stone-200">
            {children}
          </div>
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}