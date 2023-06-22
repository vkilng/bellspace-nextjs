import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ClockCounterClockwise from "@phosphor-icons/react/ClockCounterClockwise";
import ArrowFatUp from "@phosphor-icons/react/ArrowFatUp";
import ChatCenteredDots from "@phosphor-icons/react/ChatCenteredDots";
import CaretDown from "@phosphor-icons/react/CaretDown";
import formatDistance from "date-fns/formatDistance";
import Image from "next/image";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Superscript from "@tiptap/extension-superscript";
import Placeholder from "@tiptap/extension-placeholder";
import EditorLink from "@tiptap/extension-link";
import Link from "next/link";
import { useState, useContext, useEffect } from "react";
import { CurrentUserContext } from "./Context";
import { useRouter } from "next/router";
import { MinusCircle, ShareNetwork } from "@phosphor-icons/react";
import CommentsBlock from "./CommentsBlock";
import TiptapEditor from "./TiptapEditor";
import { v4 as uuidv4 } from "uuid";


export default function CommentCard({ comment }) {
  const router = useRouter();
  const currentUser = useContext(CurrentUserContext);

  const commentContent = useEditor({
    content: JSON.parse(comment.body),
    editable: false,
    extensions: [
      StarterKit,
      Superscript,
      Placeholder.configure({
        placeholder: 'Text (optional)',
      }),
      EditorLink.configure({ openOnClick: true }),
    ],
  })

  const [startVote, setStartVote] = useState(null);

  const [currentVote, setCurrentVote] = useState(null);
  const [upvoteCount, setUpvoteCount] = useState(comment.upvotes);
  const handleUpvote = () => {
    if (currentVote === true) {
      setCurrentVote(null);
      setUpvoteCount(upvoteCount - 1);
      if (currentUser.upvoted.includes(comment._id)) currentUser.upvoted.splice(currentUser.upvoted.indexOf(comment._id), 1);
    } else {
      setCurrentVote(true);
      (currentVote === null) ? setUpvoteCount(upvoteCount + 1) : setUpvoteCount(upvoteCount + 2);
      if (!currentUser.upvoted.includes(comment._id)) currentUser.upvoted.push(comment._id);
      if (currentUser.downvoted.includes(comment._id)) currentUser.downvoted.splice(currentUser.downvoted.indexOf(comment._id), 1);
    }
  }
  const handleDownVote = () => {
    if (currentVote === false) {
      setCurrentVote(null);
      setUpvoteCount(upvoteCount + 1);
      if (currentUser.downvoted.includes(comment._id)) currentUser.downvoted.splice(currentUser.downvoted.indexOf(comment._id), 1);
    } else {
      setCurrentVote(false);
      (currentVote === null) ? setUpvoteCount(upvoteCount - 1) : setUpvoteCount(upvoteCount - 2);
      if (!currentUser.downvoted.includes(comment._id)) currentUser.downvoted.push(comment._id);
      if (currentUser.upvoted.includes(comment._id)) currentUser.upvoted.splice(currentUser.upvoted.indexOf(comment._id), 1);
    }
  }

  // set existing current vote from comment and currentUser data at the time of mounting
  useEffect(() => {
    if (currentUser) {
      if (currentUser.downvoted.includes(comment._id)) {
        setCurrentVote(false);
        setStartVote(false);
      }
      if (currentUser.upvoted.includes(comment._id)) {
        setCurrentVote(true);
        setStartVote(true);
      }
      if (currentUser.saved.includes(comment._id)) setSaved(true);
    }
  }, [])

  // Handling comment request to update vote variables on element unmount
  async function componentCleanup() {
    if (currentUser && (currentVote !== startVote)) {
      try {
        const res = await fetch(`/api/comment/${comment._id}/vote`, {
          method: 'comment',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentVote }),
        });
        if (res.status === 200)
          console.log('Successful: ', await res.text());
        else
          console.error(await res.text());
      } catch (error) {
        console.error(error);
      }
    }
  }

  useEffect(() => {
    async function unloadCleanup(e) {
      e.preventDefault();
      await componentCleanup();
      // return e.returnValue = '';
    }
    window.addEventListener('beforeunload', unloadCleanup);
    return async () => {
      window.removeEventListener('beforeunload', unloadCleanup);
      await componentCleanup();
    }
  }, [currentVote])

  // *** Comment's REPLY handlers ***
  const [replyForm, setReplyForm] = useState(false);
  const [content, setContent] = useState("");
  const [editorIsEmpty, setEditorIsEmpty] = useState(true);
  const handleReplyEditorStates = (body, value) => {
    setContent(body);
    setEditorIsEmpty(value);
  };

  // Reply Editor clearing handler
  const [editorKey, setEditorKey] = useState(uuidv4());
  const askToClear = () => {
    setEditorKey(uuidv4());
    setReplyForm(false);
  }

  // Reply submit handlers
  const handleSubmit = async (e) => {
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
        const res = await fetch(
          `/api/user/${router.query.username}/comments/${router.query.postID}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(commentFormData),
          }
        );
        if (res.status === 200) {
          askToClear();
          const { new_comment } = await res.json();
          comment.replies.push(new_comment);
        } else console.error(await res.text());
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="grid gap-1 auto-rows-min">
      <div className="p-1 grid grid-rows-[min-content_min-content]">
        <div className="flex gap-2 items-center">
          {comment.author.profile_pic_url ?
            <Image src={comment.author.profile_pic_url} alt="pp" width={16} height={16} />
            :
            <Image src='/images/blank-profile-pic.png' alt='pp' width={20} height={20} className="rounded-full" />
          }
          <Link href={`/user/${comment.author.username}`} onClick={(e) => e.stopPropagation()}
            className="text-sm text-sky-500 no-underline hover:underline shrink-0"
          >
            {comment.author.username}
          </Link>
          <div className="flex gap-1 items-center">
            <ClockCounterClockwise size={12} className='ms-2' />
            <div className="text-xs">{formatDistance(new Date(comment.created_at), new Date())} ago</div>
          </div>
        </div>
        <div className="flex gap-4">
          <div>
            <div className="flex gap-4 text-sm">
              <Divider orientation="vertical" variant="middle" flexItem className="ml-2" />
              <EditorContent editor={commentContent} />
            </div>
            <div className="flex gap-5 items-center">
              {comment.replies ?
                <IconButton className="p-0.5">
                  <MinusCircle size={16} />
                </IconButton> :
                <div></div>
              }
              <div className="flex gap-2 items-center h-min">
                <IconButton className="vote-btn" onClick={currentUser && handleUpvote}>
                  <ArrowFatUp size={16}
                    weight={(currentVote === null) ? 'regular' : 'fill'}
                    color={(currentVote === true) ? '#f59e0b' : '#a8a29e'}
                  />
                </IconButton>
                <div className="text-sm">{formatNumber(upvoteCount)}</div>
                <IconButton className="vote-btn rotate-180" onClick={currentUser && handleDownVote}>
                  <ArrowFatUp size={16}
                    weight={(currentVote === null) ? 'regular' : 'fill'}
                    color={(currentVote === false) ? '#3b82f6' : '#a8a29e'}
                  />
                </IconButton>
              </div>
              <Button startIcon={<ChatCenteredDots size={16} />} color="info" onClick={() => setReplyForm(true)}
                className="text-xs normal-case" disabled={!currentUser}
              >
                Reply
              </Button>
              <Button startIcon={<ShareNetwork size={12} />} color="secondary"
                className="text-xs normal-case" disabled
              >
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
      {replyForm &&
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
            <input
              type="hidden"
              name="depth"
              hidden
              value={comment.depth + 1}
            />
            <input
              type="hidden"
              name="comment_content"
              hidden
              value={content}
            />
            <TiptapEditor
              options={{ type: "comment", func: handleReplyEditorStates }}
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
      }
      {comment.replies && comment.replies.length ?
        <div className="flex gap-2">
          <Divider orientation="vertical" flexItem className="ml-3" />
          <div className="mt-3">
            <CommentsBlock comments={comment.replies} />
          </div>
        </div>
        : null
      }
    </div>
  )
}

const formatNumber = (num) => {
  if (num > 999)
    return `${Math.floor(num / 100) / 10}k`
  else if (num < -999)
    return `${Math.ceil(num / 100) / 10}k`
  else
    return `${num}`
}