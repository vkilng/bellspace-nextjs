import { useContext, useState } from 'react';
import { CurrentUserContext } from '@/components/Context';
import useSWR from 'swr'
import fetcher from '@/lib/helperFunctions/fetcher';
import CreateCommunityModal from './CreateCommunityModal';

import Button from '@mui/material/Button'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Link from 'next/link';

export default function Sidebar() {
  const currentUser = useContext(CurrentUserContext)

  // Create Community Modal handlers
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  // Collapse handlers
  const [open, setOpen] = useState(true);
  const handleClick = () => {
    setOpen(!open);
  };

  const { data: { communityList } = [], error, isLoading } = useSWR('/api/r/get-list', fetcher);

  return (
    <div className="grid p-2 h-full bg-stone-50 font-sans content-between overflow-y-auto">
      <Box className='p-2'>
        <List component="nav" aria-label="main mailbox folders">

          {currentUser &&
            <ListItemButton onClick={handleModalOpen} className='rounded-sm mb-1'>
              <ListItemIcon><AddOutlinedIcon /></ListItemIcon>
              <ListItemText primary="Create Community" disableTypography className='font-semibold' />
            </ListItemButton>
          }
          {modalOpen && <CreateCommunityModal handleClose={handleModalClose} modalOpen={modalOpen} />}

          <ListItemButton onClick={handleClick} className='rounded-sm mb-1'>
            <ListItemText primary="Communities" disableTypography className='font-semibold' />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding className='ms-5'>
              {communityList && communityList.map((communityObj, index) =>
                <ListItemButton className='mb-1'
                  component={Link} href={`/r/${communityObj.name}`}
                  key={communityObj._id}
                >
                  <ListItemText disableTypography className='font-semibold'>{`r/${communityObj.name}`}</ListItemText>
                </ListItemButton>
              )}
            </List>
          </Collapse>

        </List>
      </Box>

      <div className='p-2'>
        {
          currentUser ? (
            <ListItemButton component={Link} href={`/user/${currentUser.username}/submit`} className='rounded-sm'>
              <ListItemIcon><AddOutlinedIcon /></ListItemIcon>
              <ListItemText primary="Create Post" disableTypography className='font-semibold' />
            </ListItemButton>
          )
            : (
              <div className='grid justify-center'>
                <div className='mb-4'>
                  Create an account to follow your favorite communities and start taking part in conversations.
                </div>
                <Button href='/register' variant="contained" color="primary"
                  className='mb-4 rounded-full normal-case font-bold'>
                  Join Bellspace
                </Button>
              </div>
            )
        }
        <div className='px-4'>
          <Divider className='my-2 -mx-4' />
          <div className='text-center my-4'>This is a NextJS project by vkilng</div>
        </div>
      </div>
    </div>
  )
}