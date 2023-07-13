import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import fetcher from "@/lib/helperFunctions/fetcher";
import PostOverviewCard from "@/components/PostOverviewCard";
import CommunityInfoPanel from "@/components/CommunityInfoPanel";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import type { postObj } from "@/lib/customTypes";
import { CurrentUserContext } from "@/lib/context";
import CircularProgress from "@mui/material/CircularProgress";
import { useBannerStore } from "@/lib/store";

export default function Community() {
  const currentUser = useContext(CurrentUserContext);
  const router = useRouter();
  const setBannerContent = useBannerStore((state) => state.setBannerContent);

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

  useEffect(() => {
    if (community.name)
      setBannerContent({
        icon: "image",
        text: `r/${community.name}`,
        image: community.profilepic,
      });
  }, [community]);

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

  if ("name" in community)
    return (
      <div className="grid overflow-y-auto h-full">
        <div className="lg:hidden">
          <CommunityInfoPanel community={community} key={community._id} />
        </div>
        <div className="grid grid-rows-[min-content_1fr] lg:overflow-y-hidden h-full">
          <Tabs
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: "divider" }}
            className="lg:m-2 sticky top-0 bg-white z-10 dark:bg-black"
          >
            <Tab component={Link} href="/" label="POSTS" className="text-xs lg:text-sm" />
            <Tab
              component={Link}
              href={`${router.asPath}/rules`}
              label="RULES"
              disabled
              className="text-xs lg:text-sm"
            />
          </Tabs>
          <div className="scroll-up-container overflow-y-auto p-3 md:p-5 lg:p-10 grid auto-rows-min lg:grid-cols-[1.5fr_1fr] xl:grid-cols-[2fr_1fr] gap-5">
            <div className="overflow-y-auto lg:mb-10 grid auto-rows-min gap-4 p-1">
              {posts.length ? (
                posts.map((post: postObj) => (
                  <PostOverviewCard
                    post={post}
                    key={post._id}
                    propRef={undefined}
                  />
                ))
              ) : (
                <div className="h-full flex items-center justify-center">
                  No posts yet
                </div>
              )}
            </div>
            <div className="hidden lg:block">
              <CommunityInfoPanel community={community} key={community._id} />
            </div>
          </div>
        </div>
      </div>
    );
}
