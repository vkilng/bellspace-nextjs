import useSWR from "swr";
import dynamic from "next/dynamic";
import type { postObj } from "@/lib/customTypes";
import { v4 as uuidv4 } from "uuid";
import fetcher from "@/lib/helperFunctions/fetcher";
import CircularProgress from "@mui/material/CircularProgress";
import { useContext, useEffect, useRef } from "react";
import { useBannerStore } from "@/lib/store";

const PostOverviewCard = dynamic(
  () => import("@/components/PostOverviewCard"),
  {
    loading: () => (
      <div className="bg-stone-200 dark:bg-[#121212] max-w-2xl h-32"></div>
    ),
  }
);

export default function Home() {
  const setBannerContent = useBannerStore((state) => state.setBannerContent);
  useEffect(() => {
    setBannerContent({ icon: "home", text: "Home" });
  }, []);

  // Scroll To Post handlers
  const containerRef = useRef<null | HTMLDivElement>(null);
  const cardToScrollRef = useRef<null | HTMLElement>(null);
  useEffect(() => {
    setTimeout(() => {
      if (containerRef.current !== null && cardToScrollRef.current !== null) {
        const y = cardToScrollRef.current.getBoundingClientRect().top;
        containerRef.current.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 200);
  }, [cardToScrollRef.current]);

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
    <div
      className="scroll-up-container h-full grid grid-rows-[1fr] grid-cols-[2.3fr_0.7fr] overflow-y-auto gap-5"
      ref={containerRef}
    >
      <div className="grid auto-rows-min gap-4 py-10 pl-10">
        {posts.length
          ? posts.map((post: postObj) => (
              <PostOverviewCard
                post={post}
                propRef={
                  window.location.hash &&
                  window.location.hash.slice(1) === post._id
                    ? cardToScrollRef
                    : undefined
                }
                key={uuidv4()}
              />
            ))
          : "No posts yet"}
      </div>
      <div className="h-min py-10 pr-10 text-center">Annoucements</div>
    </div>
  );
}
