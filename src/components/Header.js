/* eslint-disable @next/next/no-img-element */
import { useState, useContext } from "react";
import { CurrentUserContext } from '../lib/context';
import Button from "@mui/material/Button";
import SearchBar from './SearchBar';
import AccountCircleMenu from './AccountCircleMenu';
import LightDarkMenu from "./LightDarkMenu";
import PageBanner from "./PageBanner";
import Link from "next/link";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

import dynamic from "next/dynamic";
import IconButton from '@mui/material/IconButton'
import { useBannerStore } from "@/lib/store";
const LoginModal = dynamic(() => import('./LoginModal'))

export default function Header() {
  const currentUser = useContext(CurrentUserContext);
  const sidebarHidden = useBannerStore(state => state.sidebarHidden);
  const toggleSidebar = useBannerStore(state => state.toggleSidebar);

  // Log In Modal handlers
  const [LogInopen, setLogInOpen] = useState(false);
  const handleLogInModalOpen = () => setLogInOpen(true);
  const handleLogInModalClose = () => setLogInOpen(false);

  return (
    <div className="z-20 flex justify-between items-center py-2 px-5 lg:px-10">
      <div className="justify-self-start flex gap-3 lg:gap-10 items-center justify-center">
        <Link href='/'>
          <img src="/images/Bellspace-logo.png" alt="Logo" className="max-w-[10vw] hidden lg:block" />
          <img src="/images/turbine-icon.webp" alt="Logo" className="max-w-[7vw] lg:hidden block" />
        </Link>
        <PageBanner />
      </div>

      <SearchBar />

      <div className="justify-self-end flex flex-nowrap items-center gap-10">
        {
          currentUser ?
            <div className="hidden lg:block">
              <AccountCircleMenu />
            </div>
            :
            (
              <Button variant="contained" className="h-min rounded-full normal-case text-sm font-bold px-10 py-1.5 hidden lg:flex"
                onClick={handleLogInModalOpen}
              >
                Log In
              </Button>
            )
        }
        <div className="hidden lg:block">
          <LightDarkMenu />
        </div>
        <div className="ms-2 lg:hidden">
          {sidebarHidden &&
            <IconButton aria-label="" onClick={toggleSidebar}>
              <MenuOpenIcon />
            </IconButton>
          }
        </div>
        {LogInopen && <LoginModal handleClose={handleLogInModalClose} LogInOpen={LogInopen} />}
      </div>
    </div>
  );
}
