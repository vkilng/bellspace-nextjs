import { useRouter } from "next/router";
import useSWR from "swr";
import fetcher from "@/lib/helperFunctions/fetcher";
import PostOverviewCard from "@/components/PostOverviewCard";
import type { postObj, commentObj } from "@/lib/customTypes";
import UserSubLayout from "@/components/UserSubLayout";
import CircularProgress from "@mui/material/CircularProgress";
import mergeCollections from "@/lib/helperFunctions/mergeCollections";
import { v4 as uuidv4 } from "uuid";
import CommentOverviewCard from "@/components/CommentOverviewCard";

export default function UserProfile() {
  const router = useRouter();

  // fetch user info using SWR
  const {
    data: { requestedUser = {}, posts = [], comments = [] } = {},
    error,
    isLoading,
  } = useSWR(`/api/user/${router.query.username}`, fetcher);

  if (isLoading)
    return (
      <div className="h-full w-full flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  if (error)
    return (
      <div className="h-full w-full flex items-center justify-center">
        User with that username does not exist
      </div>
    );

  return (
    <UserSubLayout
      requestedUser={requestedUser}
      tabValue={0}
      key={requestedUser._id}
    >
      {posts.length || comments.length ? (
        mergeCollections(posts, comments).map((obj: postObj | commentObj) => {
          if ("title" in obj) {
            return (
              <PostOverviewCard post={obj} key={uuidv4()} propRef={undefined} />
            );
          } else {
            return <CommentOverviewCard comment={obj} key={uuidv4()} />;
          }
        })
      ) : (
        <div className="h-full flex items-center justify-center">
          No posts yet
        </div>
      )}
    </UserSubLayout>
  );
}
