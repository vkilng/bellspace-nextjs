import { useContext, useState } from "react";
import { CurrentUserContext } from "@/lib/context";
import useSWR from "swr";
import fetcher from "@/lib/helperFunctions/fetcher";
import CreateCommunityModal from "./CreateCommunityModal";

import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Link from "next/link";
import { X } from "@phosphor-icons/react";
import IconButton from "@mui/material/IconButton";
import { CircularProgress } from "@mui/material";
import { useBannerStore } from "@/lib/store";
import LightDarkMenu from "./LightDarkMenu";
import LoginModal from "./LoginModal";
import AccountCircleMenu from "./AccountCircleMenu";

export default function Sidebar() {
  const currentUser = useContext(CurrentUserContext);
  const toggleSidebar = useBannerStore((state) => state.toggleSidebar);

  // Create Community Modal handlers
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  // Collapse handlers
  const [open, setOpen] = useState(true);
  const handleClick = () => setOpen(!open);
  const handleRouteChange = () => {
    if (window.screen.width <= 768) toggleSidebar();
  };

  // Log In Modal handlers
  const [LogInOpen, setLogInOpen] = useState(false);
  const handleLogInModalOpen = () => setLogInOpen(true);
  const handleLogInModalClose = () => setLogInOpen(false);

  const {
    data: { communityList } = [],
    error,
    isLoading,
  } = useSWR("/api/r/get-list", fetcher, {
    revalidateOnFocus: false,
    // revalidateOnMount: true,
  });

  return (
    <div className="h-full grid grid-rows-[min-content_1fr] drop-shadow-lg bg-white dark:bg-black w-[100vw] md:w-full">
      <IconButton
        aria-label="close-sidebar"
        onClick={toggleSidebar}
        className="rounded-none"
      >
        <X size={16} />
      </IconButton>
      <div className="grid p-2 font-sans content-between overflow-y-auto">
        <div>
          {currentUser && (
            <div className="lg:hidden">
              <AccountCircleMenu />
            </div>
          )}

          <div className="px-4 flex lg:hidden gap-2 items-center">
            <div className="font-semibold">Theme:</div>
            <LightDarkMenu />
          </div>

          <List
            component="nav"
            aria-label="main mailbox folders"
            className="p-0"
          >
            {currentUser && (
              <ListItemButton
                onClick={handleModalOpen}
                className="rounded-sm mb-1"
              >
                <ListItemIcon>
                  <AddOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Create Community"
                  disableTypography
                  className="font-semibold"
                />
              </ListItemButton>
            )}
            {modalOpen && (
              <CreateCommunityModal
                handleClose={handleModalClose}
                modalOpen={modalOpen}
              />
            )}
            <ListItemButton onClick={handleClick} className="rounded-sm mb-1">
              <ListItemText
                primary="Communities"
                disableTypography
                className="font-semibold"
              />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            {error ? (
              <div className="p-4 text-sm text-center">
                Error, try again later...
              </div>
            ) : isLoading ? (
              <div className="p-4 flex justify-center">
                <CircularProgress size={"1rem"} />
              </div>
            ) : (communityList && communityList.length) > 0 ? (
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding className="ms-5">
                  {communityList.map((communityObj: any, index: number) => (
                    <ListItemButton
                      className="mb-1"
                      component={Link}
                      href={`/r/${communityObj.name}`}
                      onClick={handleRouteChange}
                      key={communityObj._id}
                    >
                      <ListItemText
                        disableTypography
                        className="font-semibold"
                      >{`r/${communityObj.name}`}</ListItemText>
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            ) : (
              <div className="p-4 text-sm text-center">
                No Communities have been created
              </div>
            )}
          </List>
        </div>

        <div className="self-end">
          {currentUser ? (
            <>
              <ListItemButton
                component={Link}
                href={`/user/${currentUser.username}/submit`}
                onClick={handleRouteChange}
                className="rounded-sm"
              >
                <ListItemIcon>
                  <AddOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Create Post"
                  disableTypography
                  className="font-semibold"
                />
              </ListItemButton>
            </>
          ) : (
            <div className="grid justify-center gap-4">
              <div>
                Create an account to follow your favorite communities and start
                taking part in conversations.
              </div>
              <Button
                href="/register"
                variant="contained"
                color="primary"
                className="lg:mb-4 rounded-full normal-case font-bold"
              >
                Join Bellspace
              </Button>
              <Button
                variant="contained"
                className="rounded-full normal-case font-bold lg:hidden"
                onClick={handleLogInModalOpen}
              >
                Log In
              </Button>
            </div>
          )}
          <div className="px-4">
            <Divider className="my-2 -mx-4" />
            <div className="text-center my-4">
              This is a NextJS project by vkilng
            </div>
          </div>
        </div>
      </div>
      {LogInOpen && (
        <LoginModal LogInOpen={LogInOpen} handleClose={handleLogInModalClose} />
      )}
    </div>
  );
}
