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
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SignOut from '@phosphor-icons/react/SignOut';
import { useBannerStore } from '@/lib/store';


export default function AccountCircleMenu() {
  const currentUser = useContext(CurrentUserContext);
  const toggleSidebar = useBannerStore(state => state.toggleSidebar);

  // AccountCircleMenu menu handlers
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleSidebarClose = () => {
    if (window.screen.width <= 768) toggleSidebar();
    return setAnchorEl(null);
  }

  return (
    <div>
      <Button
        // color="info"
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
        <MenuItem className="px-3 mx-2 mb-1" onClick={handleSidebarClose} component={Link} href={`/user/${currentUser.username}`}>
          <ListItemIcon><UserCircle size={24} /></ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>

        <MenuItem className="px-3 mx-2 mb-1" onClick={handleSidebarClose} disabled>
          <ListItemIcon><SettingsOutlinedIcon /></ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>

        <MenuItem className="px-3 mx-2" onClick={handleSidebarClose} component={Link} href='/api/logout'>
          <ListItemIcon><SignOut size={24} /></ListItemIcon>
          <ListItemText>Log Out</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  )
}