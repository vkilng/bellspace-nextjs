import { useState, useContext } from 'react'
import { CurrentUserContext } from '@/lib/context';
import Link from 'next/link';
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import User from '@phosphor-icons/react/User';
import CaretDown from '@phosphor-icons/react/CaretDown';
import UserCircle from '@phosphor-icons/react/UserCircle';
import Gear from '@phosphor-icons/react/Gear';
import SignOut from '@phosphor-icons/react/SignOut';


export default function AccountCircleMenu() {
  const currentUser = useContext(CurrentUserContext);

  // AccountCircleMenu menu handlers
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Button
        color="secondary"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        disableRipple
        className="flex gap-3 items-center p-3 rounded-lg w-fit normal-case text-sm focus:bg-zinc-100 dark:focus:bg-zinc-800"
      >
        <User size={16} />
        {currentUser.username}
        <CaretDown size={12} weight="bold" />
      </Button>
      <Menu id="theme-control" anchorEl={anchorEl} open={open} onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        className="rounded-lg mt-2"
      >
        <MenuItem className="px-3 mx-2 mb-1" onClick={handleClose} component={Link} href={`/user/${currentUser.username}`}>
          <ListItemIcon><UserCircle size={24} /></ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>

        <MenuItem className="px-3 mx-2 mb-1" onClick={handleClose}>
          <ListItemIcon><Gear size={24} /></ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>

        <MenuItem className="px-3 mx-2" onClick={handleClose} component={Link} href='/api/logout'>
          <ListItemIcon><SignOut size={24} /></ListItemIcon>
          <ListItemText>Log Out</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}