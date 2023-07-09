import UserInfoPanel from "@/components/UserInfoPanel";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Link from "next/link";
import { useContext, useState, useEffect } from 'react';
import { useRouter } from "next/router";
import { CurrentUserContext } from "../lib/context";
import { useBannerStore } from "@/lib/store";


export default function UserSubLayout({ requestedUser, tabValue, children }) {
  const currentUser = useContext(CurrentUserContext)
  const router = useRouter();

  const setBannerContent = useBannerStore(state => state.setBannerContent);
  useEffect(() => {
    setBannerContent({ icon: "user", text: `u/${requestedUser.username}` });
  }, []);

  // Tab handlers
  const [value, setValue] = useState(tabValue);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="grid grid-rows-[min-content_1fr] overflow-y-hidden h-full">
      {currentUser && (currentUser.username === requestedUser.username) ?
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: "divider" }}
          className="m-2"
        >
          <Tab component={Link} href={`/user/${requestedUser.username}`} label="OVERVIEW" />
          <Tab component={Link} href={`/user/${requestedUser.username}/posts`} label="POSTS" />
          <Tab component={Link} href={`/user/${requestedUser.username}/comments`} label="COMMENTS" />
          <Tab component={Link} href={`/user/${requestedUser.username}/saved`} label="SAVED" />
          <Tab component={Link} href={`/user/${requestedUser.username}/upvoted`} label="UPVOTED" />
          <Tab component={Link} href={`/user/${requestedUser.username}/downvoted`} label="DOWNVOTED" />
        </Tabs>
        :
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: "divider" }}
          className="m-2"
        >
          <Tab component={Link} href={`/user/${requestedUser.username}`} label="OVERVIEW" />
          <Tab component={Link} href={`/user/${requestedUser.username}/posts`} label="POSTS" />
          <Tab component={Link} href={`/user/${requestedUser.username}/comments`} label="COMMENTS" />
        </Tabs>

      }
      <div className="scroll-up-container overflow-y-auto p-10 grid auto-rows-min lg:grid-cols-[1.5fr_1fr] xl:grid-cols-[2fr_1fr] gap-5">
        <div className="overflow-y-auto grid auto-rows-min gap-4 p-1">
          {children}
        </div>
        <UserInfoPanel requestedUser={requestedUser} />
      </div>
    </div>
  )
}