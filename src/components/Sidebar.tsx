import { useContext, useState } from "react";
import { CurrentUserContext } from "@/lib/context";
import useSWRImmutable from "swr/immutable";
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

export default function Sidebar() {
  const currentUser = useContext(CurrentUserContext);
  const toggleSidebar = useBannerStore((state) => state.toggleSidebar);

  // Create Community Modal handlers
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  // Collapse handlers
  const [open, setOpen] = useState(true);
  const handleClick = () => {
    setOpen(!open);
  };

  const {
    data: { communityList } = [],
    error,
    isLoading,
  } = useSWRImmutable("/api/r/get-list", fetcher);

  if (error) return <div>Error occurred</div>;

  return (
    <div className="h-full grid grid-rows-[min-content_1fr]">
      <IconButton
        aria-label="close-sidebar"
        onClick={toggleSidebar}
        className="rounded-none"
      >
        <X size={16} />
      </IconButton>
      <div className="grid p-2 font-sans content-between overflow-y-auto">
        <List component="nav" aria-label="main mailbox folders" className="p-0">
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
          {isLoading ? (
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
        <div className="p-2 self-end">
          {currentUser ? (
            <ListItemButton
              component={Link}
              href={`/user/${currentUser.username}/submit`}
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
          ) : (
            <div className="grid justify-center">
              <div className="mb-4">
                Create an account to follow your favorite communities and start
                taking part in conversations.
              </div>
              <Button
                href="/register"
                variant="contained"
                color="primary"
                className="mb-4 rounded-full normal-case font-bold"
              >
                Join Bellspace
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
    </div>
  );
}
