/* eslint-disable @next/next/no-img-element */
import { useContext, useEffect, useState, forwardRef } from "react"
import Link from "next/link";
import formatDistance from "date-fns/formatDistance";

import Button from "@mui/material/Button";
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton'
import ArrowFatUp from '@phosphor-icons/react/ArrowFatUp';
import ChatCenteredText from "@phosphor-icons/react/ChatCenteredText";
import BookmarkSimple from "@phosphor-icons/react/BookmarkSimple";
import ShareNetwork from '@phosphor-icons/react/ShareNetwork';
import ClockCounterClockwise from '@phosphor-icons/react/ClockCounterClockwise';
import { CurrentUserContext } from "@/lib/context";
import { useRouter } from "next/router";
import Carousel from "react-material-ui-carousel";
import { v4 as uuidv4 } from "uuid";
import Image from "./Image";

const PostOverviewCard = ({ post, propRef }) => {
  const router = useRouter();
  const currentUser = useContext(CurrentUserContext);

  const [startVote, setStartVote] = useState(null);

  // Save post handlers
  const [saved, setSaved] = useState(false);
  const handleSave = async (e) => {
    e.stopPropagation();
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
  const handleUpvote = (e) => {
    e.stopPropagation();
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
  const handleDownVote = (e) => {
    e.stopPropagation();
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

  const openPost = (e) => {
    e.preventDefault();
    const href = post.community ? `/r/${post?.community.name}/comments/${post._id}` : `/user/${post?.author.username}/comments/${post._id}`;
    router.push(href);
  }

  return (
    <Card onClick={openPost} variant="outlined" ref={propRef}
      className="max-w-2xl cursor-pointer shadow-sm hover:outline hover:outline-1 hover:outline-stone-500 border-none"
    >
      <div className="flex p-4 gap-4 max-w-2xl">
        <div className="grid items-center justify-items-center h-min">
          <IconButton className="vote-btn"
            onClick={currentUser ? handleUpvote : (e) => e.stopPropagation()}
          >
            <ArrowFatUp size={28}
              weight={(currentVote === null) ? 'regular' : 'fill'}
              color={(currentVote === true) ? '#f59e0b' : '#a8a29e'}
            />
          </IconButton>
          <div className="text-lg">{formatNumber(upvoteCount)}</div>
          <IconButton className="vote-btn rotate-180"
            onClick={currentUser ? handleDownVote : (e) => e.stopPropagation()}
          >
            <ArrowFatUp size={28}
              weight={(currentVote === null) ? 'regular' : 'fill'}
              color={(currentVote === false) ? '#3b82f6' : '#a8a29e'}
            />
          </IconButton>
        </div>
        <div className="grid auto-rows-min gap-3 content-between flex-grow">
          <div className="grid gap-3 auto-rows-min">
            <div className="flex gap-1 text-sm items-center flex-wrap">
              {post.community &&
                <Link href={`/r/${post.community.name}`} onClick={(e) => e.stopPropagation()}
                  className="text-black text-base font-bold me-2 no-underline hover:underline dark:text-white">
                  r/{post.community.name}
                </Link>
              }
              Posted by
              <Link href={`/user/${post.author.username}`} onClick={(e) => e.stopPropagation()}
                className="text-black no-underline hover:underline dark:text-white"
              >
                u/{post.author.username}
              </Link>
              <ClockCounterClockwise size={16} className='ms-2' />
              <div>{formatDistance(new Date(post.created_at), new Date())} ago</div>
            </div>
            <div className="font-bold text-xl">
              {post.title}
            </div>
            {post.images && post.images.length > 0 &&
              <Carousel autoPlay={false} indicators={false} fullHeightHover={false} className="w-full">
                {post.images.map(imageObj =>
                  <div key={imageObj._id} className="flex items-center justify-center bg-stone-900 min-w-fit max-w-full">
                    <Image image={imageObj} classes={'h-80'} alt={"an error occurred showing image"} />
                  </div>
                )}
              </Carousel>
            }
          </div>
          <div className="flex gap-6 items-center">
            <div className="flex gap-1 items-center">
              <ChatCenteredText size={24} />
              <div>{post.commentCount}</div>
              Comments
            </div>
            <Button startIcon={<ShareNetwork size={24} />} onClick={(e) => e.stopPropagation()} className="normal-case dark:text-zinc-400" color="info">
              Share
            </Button>
            {currentUser &&
              <Button variant="text" className="normal-case dark:text-zinc-400" color="info" onClick={handleSave}
                startIcon={<BookmarkSimple size={24} weight={saved ? 'fill' : 'regular'} color='#44403c' />}
                disabled={!currentUser}
              >
                {saved ? 'Saved' : 'Save'}
              </Button>
            }
          </div>
        </div>
      </div>
    </Card>
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

export default PostOverviewCard;