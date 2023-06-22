import { useContext, useState } from "react";
import { CurrentUserContext } from "@/components/Context";
import { v4 as uuidv4 } from "uuid";
import useSWR from "swr";
import fetcher from "@/lib/helperFunctions/fetcher";
import { useRouter } from "next/router";
import PostDetailedCard from "@/components/PostDetailedCard";
import UserInfoPanel from "@/components/UserInfoPanel";
import CommentsBlock from "@/components/CommentsBlock";
import Divider from "@mui/material/Divider";
import TiptapEditor from "@/components/TiptapEditor";
import CaretDown from "@phosphor-icons/react/dist/icons/CaretDown";
import Button from "@mui/material/Button";
import commentTree from "@/lib/helperFunctions/commentTree";
import CircularProgress from "@mui/material/CircularProgress";

export default function UserPost() {
  const router = useRouter();
  const currentUser = useContext(CurrentUserContext);

  // fetch post info using SWR
  const {
    data: { requestedUser = {}, post = {}, comments = [] } = {},
    error,
    isLoading,
    mutate,
  } = useSWR(
    `/api/user/${router.query.username}/comments/${router.query.postID}`,
    fetcher
  );

  // Comment Editor content handlers
  const [content, setContent] = useState("");
  const [editorIsEmpty, setEditorIsEmpty] = useState(true);
  const handleCommentStates = (body: string, value: boolean) => {
    setContent(body);
    setEditorIsEmpty(value);
  };

  // Comment Editor clearing handler
  const [editorKey, setEditorKey] = useState(uuidv4());
  const askToClear = () => {
    setEditorKey(uuidv4());
    mutate();
  };

  // Comment form submit handlers
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editorIsEmpty) {
      console.log("comment cannot be empty!");
      return;
    }
    const commentFormData = Object.fromEntries(
      new FormData(e.currentTarget).entries()
    );
    try {
      if (currentUser) {
        const res = await fetch(
          `/api/user/${router.query.username}/comments/${router.query.postID}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(commentFormData),
          }
        );
        if (res.status === 200) askToClear();
      }
    } catch (error) {
      console.error(error);
    }
  };

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
    <div className="grid grid-rows-1 overflow-y-hidden h-full bg-stone-200">
      <div className="overflow-y-auto p-10 grid auto-rows-1 lg:grid-cols-[1.5fr_1fr] xl:grid-cols-[2fr_1fr] gap-5">
        <div>
          <PostDetailedCard post={post} />
          <Divider className="my-2 -mx-2" />
          {currentUser && (
            <div>
              <form onSubmit={handleSubmit} className="grid gap-1">
                <div className="px-2">
                  comment as {currentUser.username} <CaretDown size={12} />
                </div>
                <input
                  type="hidden"
                  name="comment_content"
                  hidden
                  value={content}
                />
                <TiptapEditor
                  options={{
                    type: "comment",
                    functions: [handleCommentStates,()=>{}],
                  }}
                  key={editorKey}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  size="small"
                  className="w-min rounded-full px-10 font-bold justify-self-end normal-case"
                  disableElevation
                >
                  Comment
                </Button>
              </form>
              <Divider className="my-2 -mx-2" />
            </div>
          )}
          <div className="p-2 bg-stone-100 rounded-sm" id="comments-block">
            <CommentsBlock comments={commentTree(comments)} />
          </div>
        </div>
        <UserInfoPanel requestedUser={requestedUser} />
      </div>
    </div>
  );
}
