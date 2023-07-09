/* eslint-disable @next/next/no-img-element */
import {
  createTheme,
  ThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles";
import { useState } from "react";
import isEmail from "validator/lib/isEmail";
import RegisterModal from "@/components/RegisterModal";

import Head from "next/head";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";

const myTheme = createTheme({
  palette: {
    primary: {
      main: "#2dd4bf",
      contrastText: "#fff",
    },
    secondary: {
      main: "#fbbf24",
    },
    error: {
      main: "#dc2626",
    },
    info: {
      main: "#0ea5e9",
    },
    success: {
      main: "#84cc16",
    },
  },
});

export default function Register() {
  // Register Modal handlers
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const handleRegisterModalOpen = () => {
    if (!emailIsEmpty) setRegisterModalOpen(true);
    else {
      setEmailIsValid(false);
      setEmailHelperText("Please enter an email address to continue");
    }
  };
  const handleRegisterModalClose = () => setRegisterModalOpen(false);

  // Email validator handlers
  const [emailValue, setEmailValue] = useState("");
  const [emailIsValid, setEmailIsValid] = useState(true);
  const [emailIsEmpty, setEmailIsEmpty] = useState(true);
  const [emailHelperText, setEmailHelperText] = useState("");
  const handleEmailIsValid = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailValue(e.target.value);
    if (e.target.value) {
      setEmailIsEmpty(false);
      setEmailIsValid(isEmail(e.target.value));
      isEmail(e.target.value)
        ? setEmailHelperText("")
        : setEmailHelperText("That email is invalid");
    } else {
      setEmailIsEmpty(true);
      setEmailIsValid(true);
      setEmailHelperText("");
    }
  };

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
        <div className="flex w-full h-full">
          <div className="max-[374px]:hidden w-1/4 flex-shrink-0">
            <div className="bg-cover h-full bg-[url('/images/signup-art.jpg')]"></div>
          </div>
          <div>
            <div className=" grid items-center h-full">
              <div className="p-10 lg:w-1/2">
                <IconButton href="/" className="mb-5 -ms-3">
                  <ArrowBackIcon />
                </IconButton>
                <div className="text-lg font-medium mb-3">Sign Up</div>
                <div className="text-sm lg:mb-10">
                  By continuing, you are setting up a Bellspace account and
                  agree to our User Agreement and Privacy Policy.
                </div>
                <div className="mt-10">
                  <Button
                    href="/api/login/auth/google"
                    variant="outlined"
                    size="large"
                    color="secondary"
                    fullWidth
                    className="normal-case rounded-full bg-white border-gray-300 hover:bg-[rgb(238,238,238)] hover:border-gray-300 focus:outline-none"
                    startIcon={
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/32px-Google_%22G%22_Logo.svg.png"
                        alt='Google "G" Logo'
                        width={20}
                        height={20}
                      />
                    }
                  >
                    <div className="p-1 w-full flex justify-center text-base font-semibold text-stone-500">
                      Continue with Google
                    </div>
                  </Button>
                </div>
                <Divider className="my-8">OR</Divider>
                <div className="grid gap-7 justify-self-center">
                  <TextField
                    variant="outlined"
                    label="EMAIL"
                    required
                    error={!emailIsValid}
                    helperText={emailHelperText}
                    onChange={handleEmailIsValid}
                    autoComplete="email"
                  />
                  <Button
                    variant="contained"
                    className="h-min rounded-lg normal-case text-base font-bold px-10 py-2"
                    onClick={handleRegisterModalOpen}
                    disabled={!emailIsValid}
                  >
                    Continue
                  </Button>
                  {registerModalOpen && (
                    <RegisterModal
                      handleClose={handleRegisterModalClose}
                      registerOpen={registerModalOpen}
                      emailValue={emailValue}
                      setEmailIsValid={setEmailIsValid}
                      setEmailHelperText={setEmailHelperText}
                    />
                  )}
                </div>
                <div className="my-8 font-semibold font-sans text-stone-600">
                  Already have an account? <Link href="/">Log In</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

Register.ditchLayout = true;
