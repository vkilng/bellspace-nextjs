/* eslint-disable @next/next/no-img-element */
import { useState, useContext } from "react";
import { CurrentUserContext } from '../lib/context';
import Button from "@mui/material/Button";
import SearchBar from './SearchBar';
import AccountCircleMenu from './AccountCircleMenu';
import LightDarkMenu from "./LightDarkMenu";
import PageBanner from "./PageBanner";
import Link from "next/link";

import dynamic from "next/dynamic";
const LoginModal = dynamic(() => import('./LoginModal'))

export default function Header() {
  const currentUser = useContext(CurrentUserContext);

  // Log In Modal handlers
  const [LogInopen, setLogInOpen] = useState(false);
  const handleLogInModalOpen = () => setLogInOpen(true);
  const handleLogInModalClose = () => setLogInOpen(false);

  return (
    <div className="z-20 flex justify-between items-center py-2 px-10">
      <div className="justify-self-start flex gap-10 items-center justify-center">
        <Link href='/'>
          <img src="/images/Bellspace-logo.png" alt="Logo" className="max-w-[10vw] block" />
        </Link>
        <PageBanner />
      </div>

      <SearchBar />

      <div className="justify-self-end flex flex-nowrap items-center gap-10">
        {
          currentUser ?
            <AccountCircleMenu />
            :
            (
              <Button variant="contained" className="h-min rounded-full normal-case text-sm font-bold px-10 py-1.5"
                onClick={handleLogInModalOpen}
              >
                Log In
              </Button>
            )
        }
        <LightDarkMenu />
        {LogInopen && <LoginModal handleClose={handleLogInModalClose} LogInopen={LogInopen} />}
      </div>
    </div>
  );
}
