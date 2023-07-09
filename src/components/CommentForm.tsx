import { useContext, useState } from "react";
import { CurrentUserContext } from "@/lib/context";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";
import TiptapEditor from "@/components/TiptapEditor";
import CaretDown from "@phosphor-icons/react/dist/icons/CaretDown";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

export default function CommentForm({ mutate }: any) {
  const router = useRouter();
  const currentUser = useContext(CurrentUserContext);

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

  return (
    <div>
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
                functions: [handleCommentStates, () => {}],
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
    </div>
  );
}
