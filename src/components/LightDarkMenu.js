import { useState } from 'react'
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from "@mui/material/Divider";
import Sun from '@phosphor-icons/react/Sun';
import Moon from '@phosphor-icons/react/Moon';
import CaretDown from '@phosphor-icons/react/CaretDown';

export default function LightDarkMenu() {
  // Light/Dark mode menu handlers
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
        className="p-3 rounded-lg w-fit flex gap-1"
      >
        <Sun size={20} />
        <CaretDown size={8} weight='fill' />
      </Button>
      <Menu id="theme-control" anchorEl={anchorEl} open={open} onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        className="rounded-lg mt-2"
      >
        <MenuItem className="px-3 mx-2" onClick={handleClose}>
          <ListItemIcon><Sun size={20} /></ListItemIcon>
          <ListItemText className='text-sm'>Light</ListItemText>
        </MenuItem>
        <Divider variant="middle" />
        <MenuItem className="px-3 mx-2" onClick={handleClose}>
          <ListItemIcon><Moon size={20} /></ListItemIcon>
          <ListItemText className='text-sm'>Dark</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}