/* eslint-disable @next/next/no-img-element */
import { useContext, useState } from 'react';
import { CurrentUserContext } from "@/lib/context";
import format from 'date-fns/format';
import { useRouter } from 'next/router';

import Button from '@mui/material/Button'
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import Link from 'next/link';
import Image from './Image';

export default function CommunityInfoPanel({ community }) {
  const currentUser = useContext(CurrentUserContext);
  const router = useRouter();

  // currentUser membership buttons handler
  const [isMember, setIsMember] = useState(currentUser && currentUser.communities.includes(community._id));
  const [buttonVariant, setButtonVariant] = useState(false);
  const handleMouseOver = (e) => {
    if (isMember) setButtonVariant(true);
  }
  const handleMouseLeave = (e) => {
    if (isMember) setButtonVariant(false);
  }
  const handleMembership = async (e) => {
    e.target.setAttribute('disabled', 'true');
    try {
      if (isMember) {
        const res = await fetch(`/api/r/${community.name}/leave`, { method: 'post' });
        if (res.status === 200) {
          setIsMember(false);
          community.memberCount -= 1;
        }
      }
      else {
        const res = await fetch(`/api/r/${community.name}/join`, { method: 'post' });
        if (res.status === 200) {
          setIsMember(true);
          community.memberCount += 1;
          setButtonVariant(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="grid auto-rows-min h-min lg:mb-10 text-xs lg:text-base lg:rounded-xl bg-stone-100 dark:bg-zinc-950 dark:lg:bg-stone-900 dark:text-white">
      <div className="bg-gradient-to-r from-teal-400 to-teal-800 rounded-t-xl p-4 hidden lg:flex justify-between items-center">
        <div className="text-sm font-bold text-white">About Community</div>
        {currentUser && community?.moderators.includes(currentUser._id) &&
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>

        }
      </div>
      <div className='px-4 py-2 lg:p-4 flex gap-4 justify-between items-center'>
        <div className='flex gap-4 items-center'>
          <Image image={community.profilepic} classes={'w-8 h-8 lg:w-12 lg:h-12 rounded-full'} alt='img' />
          <div className='text-base font-semibold lg:text-xl'>r/{community.name}</div>
        </div>
      </div>
      <div className='flex flex-row-reverse justify-between lg:grid gap-4 px-4 lg:mb-5'>
        <div className='hidden lg:block'>{community.description}</div>
        <div className='grid'>
          <div className='flex gap-2 items-center'>
            <div className='lg:hidden'><EventOutlinedIcon fontSize='small' /></div>
            <div className='hidden lg:block'><EventOutlinedIcon /></div>
            Created
            <div>{format(new Date(community.created_at), 'MMM d, yyyy')}</div>
          </div>
          <div className='flex gap-2 items-center ms-1'>
            <span className='text-sm lg:text-lg'>{community.memberCount}</span>
            <span>{community.memberCount > 1 ? "members" : "member"}</span>
          </div>
        </div>
        <div className='flex-grow grid gap-2 lg:gap-4 items-center'>
          {(currentUser && !isMember) &&
            <Button variant="contained" color="primary"
              onClick={handleMembership} className='font-bold normal-case rounded-full text-xs lg:text-base h-min'
            >Join</Button>
          }
          {(currentUser && isMember) &&
            <Button variant={buttonVariant ? "contained" : "outlined"} color="primary"
              onClick={handleMembership} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}
              className='font-bold normal-case rounded-full text-xs lg:text-base'
            >
              {buttonVariant ? "Leave" : "Joined"}
            </Button>
          }
          {currentUser && isMember &&
            <Button variant="contained" color="primary" LinkComponent={Link} href={`/r/${community.name}/submit`}
              className='font-bold normal-case rounded-full text-xs lg:text-base'
            >
              Create post
            </Button>
          }
        </div>
      </div>
    </div>
  );
}