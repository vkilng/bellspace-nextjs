import { useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import TiptapEditor from "./TiptapEditor";
import { useRouter } from "next/router";
import { useSWRConfig } from "swr";
import { CurrentUserContext } from "../lib/context";
import CaretDown from "@phosphor-icons/react/dist/icons/CaretDown";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

export default function ReplyForm({ setReplyForm, comment }: any) {
  const router = useRouter();
  const currentUser = useContext(CurrentUserContext);
  const { mutate } = useSWRConfig();

  const [content, setContent] = useState("");
  const [editorIsEmpty, setEditorIsEmpty] = useState(true);
  const handleReplyEditorStates = (body: string, value: boolean) => {
    setContent(body);
    setEditorIsEmpty(value);
  };

  // Reply Editor clearing handler
  const [editorKey, setEditorKey] = useState(uuidv4());
  const askToClear = () => {
    setEditorKey(uuidv4());
    setReplyForm(false);
  };

  // Reply submit handlers
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editorIsEmpty) {
      console.log("reply cannot be empty!");
      return;
    }
    const commentFormData = Object.fromEntries(
      new FormData(e.currentTarget).entries()
    );
    try {
      if (currentUser) {
        const res = await fetch(`/api${router.asPath}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(commentFormData),
        });
        if (res.status === 200) {
          askToClear();
          mutate(`/api${router.asPath}`);
        } else console.error(await res.text());
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (currentUser)
    return (
      <div className="ml-4 px-2">
        <form onSubmit={handleSubmit} className="grid gap-1">
          <div className="px-2 text-xs">
            comment as {currentUser.username} <CaretDown size={12} />
          </div>
          <input
            type="hidden"
            name="parent_comment"
            hidden
            value={comment._id}
          />
          <input type="hidden" name="depth" hidden value={comment.depth + 1} />
          <input type="hidden" name="comment_content" hidden value={content} />
          <TiptapEditor
            options={{
              type: "comment",
              functions: [handleReplyEditorStates, () => {}],
            }}
            key={editorKey}
          />
          <div className="flex gap-3 justify-self-end">
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              className="w-min rounded-full px-10 font-bold justify-self-end normal-case"
              disableElevation
              onClick={() => setReplyForm(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="small"
              className="w-min rounded-full px-10 font-bold justify-self-end normal-case"
              disableElevation
            >
              Reply
            </Button>
          </div>
        </form>
        <Divider className="my-2 -mx-2" />
      </div>
    );
}
