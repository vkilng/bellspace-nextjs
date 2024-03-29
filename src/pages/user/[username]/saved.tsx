import { useRouter } from "next/router";
import useSWR from "swr";
import fetcher from "@/lib/helperFunctions/fetcher";
import PostOverviewCard from "@/components/PostOverviewCard";
import type { postObj } from "@/lib/customTypes";
import UserSubLayout from "@/components/UserSubLayout";
import CircularProgress from "@mui/material/CircularProgress";

export default function UserUpvoted() {
  const router = useRouter();

  // fetch user info using SWR
  const {
    data: { requestedUser = {}, posts = [] } = {},
    error,
    isLoading,
  } = useSWR(`/api/user/${router.query.username}/saved`, fetcher);

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
      tabValue={3}
      key={requestedUser._id}
    >
      {posts.length ? (
        posts.map((post: postObj) => (
          <PostOverviewCard post={post} key={post._id} propRef={undefined} />
        ))
      ) : (
        <div className="h-full flex items-center justify-center">
          No posts saved yet
        </div>
      )}
    </UserSubLayout>
  );
}
