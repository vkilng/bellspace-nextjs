/* eslint-disable @next/next/no-img-element */
import { useContext, useEffect, useState } from "react"
import StarterKit from "@tiptap/starter-kit";
import EditorLink from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import Link from "next/link";
import formatDistance from "date-fns/formatDistance";

import Button from "@mui/material/Button";
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import ChatCenteredText from "@phosphor-icons/react/ChatCenteredText";
import Dot from "@phosphor-icons/react/Dot";
import BookmarkSimple from "@phosphor-icons/react/BookmarkSimple";
import ShareNetwork from '@phosphor-icons/react/ShareNetwork';
import ClockCounterClockwise from '@phosphor-icons/react/ClockCounterClockwise';
import { CurrentUserContext } from "@/lib/context";
import { useRouter } from "next/router";


export default function CommentOverviewCard({ comment }) {
  const router = useRouter();
  const currentUser = useContext(CurrentUserContext);

  const commentContent = useEditor({
    content: JSON.parse(comment.body),
    editable: false,
    extensions: [
      StarterKit,
      EditorLink.configure({ openOnClick: true }),
    ],
  })

  // Save comment handlers
  const [saved, setSaved] = useState(false);
  const handleSave = async (e) => {
    e.stopPropagation();
    try {
      if (currentUser) {
        const res = await fetch(`/api/${comment._id}/save`, {
          method: 'POST'
        });
        if (res.status === 200) setSaved(!saved);
        else console.error(await res.text());
      }
    } catch (error) {
      console.error(error);
    }
  }

  // at mount
  useEffect(() => {
    if (currentUser && currentUser.saved.includes(comment._id))
      setSaved(true);
  }, [])

  const openComment = (e) => {
    e.preventDefault();
    const href = comment.post.community ? `/r/${comment.post.community.name}/comments/${comment.post._id}` :
      `/user/${comment.post.author.username}/comments/${comment.post._id}`;
    router.push(href.concat('#comments-block'));
  }

  return (
    <div className="grid gap-2 p-2 bg-stone-200 max-w-2xl dark:bg-stone-900 dark:text-white">
      <div className="flex gap-2 items-center">
        <ChatCenteredText size={24} color='#78716c' />
        <div className="flex gap-x-2 items-center flex-wrap mr-2">
          <Link href={`/user/${comment.author.username}`} onClick={(e) => e.stopPropagation()}
            className="text-xs text-sky-500 no-underline hover:underline shrink-0"
          >
            {comment.author.username}
          </Link>
          <div className="text-xs text-stone-500 shrink-0">commented on</div>
          <div className="text-xs shrink-0">{comment.post.title}</div>
          {comment.post.community &&
            <div className="shrink-0 flex items-center">
              <Dot size={16} />
              <Link href={`/r/${comment.post.community.name}`} onClick={(e) => e.stopPropagation()}
                className="text-xs text-stone-800 font-bold no-underline hover:underline shrink-0 dark:text-stone-500">
                r/{comment.post.community.name}
              </Link>
              <Dot size={16} />
            </div>
          }
          <div className="text-xs text-stone-500 shrink-0 flex">
            Posted by &nbsp;
            <Link href={`/user/${comment.post.author.username}`} onClick={(e) => e.stopPropagation()}
              className="text-stone-500 no-underline hover:underline"
            >
              u/{comment.post.author.username}
            </Link>
          </div>
        </div>
      </div>
      <Card onClick={openComment} variant="outlined"
        className="max-w-2xl cursor-pointer hover:outline hover:outline-2 hover:outline-stone-400 p-2"
      >
        <div className="flex gap-4 items-center">
          {comment.depth > 0 ?
            <>
              <Divider orientation="vertical" flexItem className="" />
              <Divider orientation="vertical" flexItem className="" />
            </> :
            <Divider orientation="vertical" flexItem className="" />
          }
          <div>
            <div className="flex gap-1 items-center text-xs">
              <div>{comment.author.username}</div>
              <div className="text-stone-500">{comment.upvotes} points</div>
              <ClockCounterClockwise size={12} color="#737373" />
              <div className="text-stone-500">{formatDistance(new Date(comment.created_at), new Date())} ago</div>
            </div>
            <EditorContent editor={commentContent} className="text-sm" />
            <div className="flex gap-4 items-center">
              <Button variant="text" color="secondary" startIcon={<ShareNetwork size={16} />}
                className="text-xs normal-case" disabled onClick={e => e.stopPropagation()}
              >
                Share
              </Button>
              {currentUser &&
                <Button variant="text" color="secondary" startIcon={<BookmarkSimple size={16} />}
                  className="text-xs normal-case" disabled onClick={e => e.stopPropagation()}
                >
                  Save
                </Button>
              }
            </div>
          </div>
        </div>
      </Card>
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