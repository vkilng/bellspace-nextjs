import { useContext, useState } from "react";
import { CurrentUserContext } from "@/lib/context";
import useSWR from "swr";
import fetcher from "@/lib/helperFunctions/fetcher";
import { useRouter } from "next/router";
import PostDetailedCard from "@/components/PostDetailedCard";
import CommunityInfoPanel from "@/components/CommunityInfoPanel";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import CommentsBlock from "@/components/CommentsBlock";
import commentTree from "@/lib/helperFunctions/commentTree";
import CommentForm from "@/components/CommentForm";
import IconButton from "@mui/material/IconButton";
import ArrowLeft from "@phosphor-icons/react/dist/icons/ArrowLeft";
import Link from "next/link";

export default function CommunityPost() {
  const router = useRouter();
  const currentUser = useContext(CurrentUserContext);

  // fetch post info using SWR
  const {
    data: { community = {}, post = {}, comments = [] } = {},
    error,
    isLoading,
    mutate,
  } = useSWR(
    `/api/r/${router.query.community}/comments/${router.query.postID}`,
    fetcher
  );

  if (isLoading)
    return (
      <div className="h-full w-full flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  if (error)
    return (
      <div className="h-full w-full flex items-center justify-center">
        That post does not exist
      </div>
    );

  return (
    <div className="grid grid-rows-[min-content_1fr] overflow-y-hidden h-full bg-slate-100 dark:bg-zinc-950">
      <div className="flex ms-10">
        <IconButton
          aria-label=""
          LinkComponent={Link}
          href={`/#${router.query.postID}`}
          className="rounded-none"
        >
          <ArrowLeft size={24} />
        </IconButton>
      </div>
      <div className="scroll-up-container overflow-y-auto p-10 pt-0 grid auto-rows-1 lg:grid-cols-[1.5fr_1fr] xl:grid-cols-[2fr_1fr] gap-5">
        <div>
          <PostDetailedCard post={post} />
          <Divider className="my-2 -mx-2" />
          <CommentForm mutate={mutate} />
          <div className="p-2 bg-white rounded-sm dark:bg-[#121212] dark:text-white" id="comments-block">
            <CommentsBlock commentsTree={commentTree(comments)} />
          </div>
        </div>
        <CommunityInfoPanel community={community} />
      </div>
    </div>
  );
}
