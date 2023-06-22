import useSWR from "swr";
import dynamic from "next/dynamic";
import type { postObj } from "@/lib/customTypes";
import { v4 as uuidv4 } from "uuid";
import fetcher from "@/lib/helperFunctions/fetcher";
import CircularProgress from "@mui/material/CircularProgress";
import { useContext, useEffect } from "react";
import { PageBannerContext } from "@/components/Context";

const PostOverviewCard = dynamic(
  () => import("@/components/PostOverviewCard"),
  {
    loading: () => <div className="bg-stone-200 max-w-2xl h-32"></div>,
  }
);

export default function Home() {
  const { setBannerContent } = useContext(PageBannerContext);
  useEffect(() => {
    setBannerContent({ icon: "home", text: "Home" });
  }, []);

  const {
    data: { posts } = [],
    error,
    isLoading,
  } = useSWR("/api/post/getall", fetcher);

  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }
  if (error) {
    return (
      <div className="overflow-y-auto p-10 grid auto-rows-min gap-2 h-full">
        An error occured, try again sometime later
      </div>
    );
  }

  return (
    <div className="h-full grid grid-rows-[1fr] grid-cols-[2.3fr_0.7fr] overflow-y-auto gap-5">
      <div className="grid auto-rows-min gap-4 py-10 pl-10">
        {posts.length
          ? posts.map((postObj: postObj) => (
              <PostOverviewCard post={postObj} key={uuidv4()} />
            ))
          : "No posts yet"}
      </div>
      <div className="h-min py-10 pr-10 text-center">Annoucements</div>
    </div>
  );
}
