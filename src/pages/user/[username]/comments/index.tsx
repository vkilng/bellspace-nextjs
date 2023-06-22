import { useRouter } from "next/router";
import useSWR from "swr";
import fetcher from "@/lib/helperFunctions/fetcher";
import CommentOverviewCard from "@/components/CommentOverviewCard";
import UserSubLayout from "@/components/UserSubLayout";
import CircularProgress from "@mui/material/CircularProgress";
import { commentObj } from "@/lib/customTypes";
import { v4 as uuidv4 } from "uuid";

export default function UserPosts() {
  const router = useRouter();

  // fetch user info using SWR
  const {
    data: { requestedUser = {}, comments = [] } = {},
    error,
    isLoading,
  } = useSWR(`/api/user/${router.query.username}/comments`, fetcher);

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
      tabValue={2}
      key={requestedUser._id}
    >
      {comments.length ? (
        comments.map((comment: commentObj) => (
          <CommentOverviewCard comment={comment} key={uuidv4()} />
        ))
      ) : (
        <div className="h-full flex items-center justify-center">
          No posts yet
        </div>
      )}
    </UserSubLayout>
  );
}
