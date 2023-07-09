import { v4 as uuidv4 } from "uuid";
import CommentCard from "./CommentCard";

export default function CommentsBlock({ commentsTree }) {
  return (
    commentsTree.length ?
      <div>
        {
          commentsTree.map(commentObj =>
            <CommentCard comment={commentObj} key={uuidv4()} />
          )
        }
      </div>
      :
      <div className="p-3 text-center">No comments yet</div>

  );
}