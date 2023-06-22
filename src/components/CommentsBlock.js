import dynamic from "next/dynamic"
import { v4 as uuidv4 } from "uuid";
import CommentCard from "./CommentCard";

// const CommentCard = dynamic(() => import('./CommentCard'), {
//   loading: <div className="p-2">... Loading</div>
// })

export default function CommentsBlock({ comments }) {
  console.info('comments array: ', comments);

  return (
    comments.length ?
      <>
        {
          comments.map(commentObj =>
            <CommentCard comment={commentObj} key={uuidv4()} />
          )
        }
      </>
      :
      <div className="p-3 text-center">No comments yet</div>

  );
}