/* eslint-disable @next/next/no-img-element */
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import EditorLink from "@tiptap/extension-link";
import { useContext, useEffect, useState } from "react"
import Link from "next/link";
import formatDistance from "date-fns/formatDistance";

import Button from "@mui/material/Button";
import IconButton from '@mui/material/IconButton'
import ArrowFatUp from '@phosphor-icons/react/ArrowFatUp';
import ChatCenteredText from "@phosphor-icons/react/ChatCenteredText";
import BookmarkSimple from "@phosphor-icons/react/BookmarkSimple";
import ShareNetwork from '@phosphor-icons/react/ShareNetwork';
import ClockCounterClockwise from '@phosphor-icons/react/ClockCounterClockwise';
import { CurrentUserContext } from "@/components/Context";
import { useRouter } from "next/router";
import Carousel from "react-material-ui-carousel";
import { v4 as uuidv4 } from "uuid";

export default function PostDetailedCard({ post }) {
  const router = useRouter();
  const currentUser = useContext(CurrentUserContext);
  const postContent = useEditor({
    content: JSON.parse(post.body),
    editable: false,
    extensions: [
      StarterKit,
      EditorLink.configure({ openOnClick: true }),
    ],
  })

  const [startVote, setStartVote] = useState(null);

  // Save post handlers
  const [saved, setSaved] = useState(false);
  const handleSave = async () => {
    try {
      if (currentUser) {
        const res = await fetch(`/api/${post._id}/save`, {
          method: 'POST'
        });
        if (res.status === 200) setSaved(!saved);
        else console.error(await res.text());
      }
    } catch (error) {
      console.error(error);
    }
  }

  const [currentVote, setCurrentVote] = useState(null);
  const [upvoteCount, setUpvoteCount] = useState(post.upvotes);
  const handleUpvote = () => {
    if (currentVote === true) {
      setCurrentVote(null);
      setUpvoteCount(upvoteCount - 1);
      if (currentUser.upvoted.includes(post._id)) currentUser.upvoted.splice(currentUser.upvoted.indexOf(post._id), 1);
    } else {
      setCurrentVote(true);
      (currentVote === null) ? setUpvoteCount(upvoteCount + 1) : setUpvoteCount(upvoteCount + 2);
      if (!currentUser.upvoted.includes(post._id)) currentUser.upvoted.push(post._id);
      if (currentUser.downvoted.includes(post._id)) currentUser.downvoted.splice(currentUser.downvoted.indexOf(post._id), 1);
    }
  }
  const handleDownVote = () => {
    if (currentVote === false) {
      setCurrentVote(null);
      setUpvoteCount(upvoteCount + 1);
      if (currentUser.downvoted.includes(post._id)) currentUser.downvoted.splice(currentUser.downvoted.indexOf(post._id), 1);
    } else {
      setCurrentVote(false);
      (currentVote === null) ? setUpvoteCount(upvoteCount - 1) : setUpvoteCount(upvoteCount - 2);
      if (!currentUser.downvoted.includes(post._id)) currentUser.downvoted.push(post._id);
      if (currentUser.upvoted.includes(post._id)) currentUser.upvoted.splice(currentUser.upvoted.indexOf(post._id), 1);
    }
  }

  // set existing current vote from post and currentUser data at the time of mounting
  useEffect(() => {
    if (currentUser) {
      if (currentUser.downvoted.includes(post._id)) {
        setCurrentVote(false);
        setStartVote(false);
      }
      if (currentUser.upvoted.includes(post._id)) {
        setCurrentVote(true);
        setStartVote(true);
      }
      if (currentUser.saved.includes(post._id)) setSaved(true);
    }
  }, [])

  // Handling post request to update vote variables on element unmount
  async function componentCleanup() {
    if (currentUser && (currentVote !== startVote)) {
      try {
        const res = await fetch(`/api/post/${post._id}/vote`, {
          method: 'POST',
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

  if (postContent) return (
    <div>
      <div className="flex p-4 bg-stone-50 gap-4">
        <div className="grid items-center justify-items-center h-min">
          <IconButton className="vote-btn" onClick={currentUser && handleUpvote}>
            <ArrowFatUp size={28}
              weight={(currentVote === null) ? 'regular' : 'fill'}
              color={(currentVote === true) ? '#f59e0b' : '#a8a29e'}
            />
          </IconButton>
          <div className="text-lg">{formatNumber(upvoteCount)}</div>
          <IconButton className="vote-btn rotate-180" onClick={currentUser && handleDownVote}>
            <ArrowFatUp size={28}
              weight={(currentVote === null) ? 'regular' : 'fill'}
              color={(currentVote === false) ? '#3b82f6' : '#a8a29e'}
            />
          </IconButton>
        </div>
        <div className="grid auto-rows-min gap-3 content-between flex-grow">
          <div className="grid gap-3 auto-rows-min">
            <div className="flex gap-1 text-sm items-center">
              {post.community && <div className="font-bold text-base me-2">r/{post.community.name}</div>}
              Posted by
              <Link href={`/user/${post.author.username}`} className="text-black no-underline hover:underline hover:cursor-pointer">
                u/{post.author.username}
              </Link>
              <ClockCounterClockwise size={16} className='ms-2' />
              <div>{formatDistance(new Date(post.created_at), new Date())} ago</div>
            </div>
            <div className="font-bold text-xl">{post.title}</div>
            {!postContent.isEmpty && <EditorContent editor={postContent} />}
            {post.images && post.images.length > 0 &&
              <Carousel autoPlay={false} fullHeightHover={false} className="w-full">
                {post.images.map(imageObj =>
                  <div key={uuidv4()} className="flex items-center justify-center bg-stone-900 min-w-fit max-w-full">
                    <img src={imageObj.url ?? '#'} alt='an error occurred showing image' height={320} />
                  </div>
                )}
              </Carousel>
            }
            {post.imgurl && <img src="post.imgurl" alt="image not found" className="rounded-2xl" />}
          </div>
          <div className="flex gap-6 items-center">
            <div className="flex gap-1 items-center">
              <ChatCenteredText size={24} />
              <div>{post.commentCount}</div>
              Comments
            </div>
            <Button startIcon={<ShareNetwork size={24} />} className="normal-case" color="info">
              Share
            </Button>
            <Button variant="text" className="normal-case" color="info" onClick={handleSave}
              startIcon={<BookmarkSimple size={24} weight={saved ? 'fill' : 'regular'} color='#44403c' />}
              disabled={!currentUser}
            >
              {saved ? 'Saved' : 'Save'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  return <div>... Loading post content</div>
}

const formatNumber = (num) => {
  if (num > 999)
    return `${Math.floor(num / 100) / 10}k`
  else if (num < -999)
    return `${Math.ceil(num / 100) / 10}k`
  else
    return `${num}`
}