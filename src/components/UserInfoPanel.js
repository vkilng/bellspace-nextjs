/* eslint-disable @next/next/no-img-element */
import format from "date-fns/format";
import Link from "next/link";

import PlusCircle from "@phosphor-icons/react/PlusCircle";
import Button from '@mui/material/Button'
import { useContext } from "react";
import { CurrentUserContext } from "@/lib/context";

export default function UserInfoPanel({ requestedUser }) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <div className="grid auto-rows-min text-sm lg:text-base lg:rounded-xl h-min bg-stone-100 dark:bg-zinc-950 dark:lg:bg-stone-900 dark:text-white">
      <div className="h-32 bg-gradient-to-r from-teal-400 to-teal-800 rounded-t-xl hidden lg:block"></div>
      <div className="top-0 mx-5 lg:-mt-24 grid gap-2">
        <div className="p-1 bg-stone-100 rounded-lg w-fit relative hidden lg:block">
          <img src="/images/blank-profile-pic.png" alt="profile-pic" className="h-28 rounded-lg" />
          {currentUser && requestedUser.username === currentUser.username &&
            <PlusCircle size={36} weight='fill' className="absolute bottom-1 right-0 m-2" />
          }
        </div>
        <div className="flex justify-between pt-4 lg:pt-0">
          <div className="font-bold lg:font-normal">u/{requestedUser.username}</div>
          {currentUser && requestedUser.username === currentUser.username &&
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4e4646" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="lg:-mt-5"
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </>
          }
        </div>
      </div>
      <div className="grid gap-7 p-4">
        <div className="flex justify-between">
          <div>
            <div className="font-semibold">Karma</div>
            <div className="text-sm">Coming soon</div>
          </div>
          <div className="mr-5">
            <div className="font-semibold">Cake Day</div>
            <div className="text-sm">
              {format(new Date(requestedUser.created_at), 'dd MMM, yyyy')}
            </div>
          </div>
        </div>
        {currentUser && requestedUser.username === currentUser.username &&
          <Button variant="contained" color="primary" LinkComponent={Link} href={`/user/${currentUser.username}/submit`}
            className="font-bold normal-case rounded-full" fullWidth
          >
            New Post
          </Button>
        }
        {currentUser && requestedUser.username !== currentUser.username &&
          <div className="flex justify-between gap-4">
            <Button variant="contained" color="primary"
              className="font-bold normal-case rounded-2xl" fullWidth
            >
              Follow
            </Button>
            <Button variant="contained" color="primary"
              className="font-bold normal-case rounded-2xl" fullWidth
            >
              Chat
            </Button>
          </div>
        }
      </div>
    </div>
  );
}