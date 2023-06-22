import { useRouter } from "next/router";
import { useContext, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import fetcher from "@/lib/helperFunctions/fetcher";
import PostOverviewCard from "@/components/PostOverviewCard";
import CommunityInfoPanel from "@/components/CommunityInfoPanel";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import type { postObj } from "@/lib/customTypes";
import { CurrentUserContext } from "@/components/Context";
import CircularProgress from "@mui/material/CircularProgress";

export default function Community() {
  const currentUser = useContext(CurrentUserContext);
  const router = useRouter();

  // Tab handlers
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // fetch community info using SWR
  const {
    data: { community = {}, posts = [] } = {},
    error,
    isLoading,
  } = useSWR(`/api/r/${router.query.community}`, fetcher);

  if (isLoading)
    return (
      <div className="h-full w-full flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  if (error)
    return (
      <div className="h-full w-full flex items-center justify-center">
        Community with that name does not exist
      </div>
    );

  return (
    <div className="grid grid-rows-[min-content_1fr] overflow-y-hidden h-full">
      <Tabs
        value={value}
        onChange={handleChange}
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: "divider" }}
        className="m-2"
      >
        <Tab component={Link} href="/" label="POSTS" />
        <Tab
          component={Link}
          href={`${router.asPath}/rules`}
          label="RULES"
          disabled
        />
      </Tabs>
      <div className="overflow-y-auto p-10 grid auto-rows-min lg:grid-cols-[1.5fr_1fr] xl:grid-cols-[2fr_1fr] gap-5">
        <div className="overflow-y-auto mb-10 grid auto-rows-min gap-4 p-1">
          {posts.length ? (
            posts.map((post: postObj) => (
              <PostOverviewCard post={post} key={post._id} />
            ))
          ) : (
            <div className="h-full flex items-center justify-center">
              No posts yet
            </div>
          )}
        </div>
        <CommunityInfoPanel community={community} key={community._id} />
      </div>
    </div>
  );
}
