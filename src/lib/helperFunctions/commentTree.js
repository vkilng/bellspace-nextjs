export default function commentTree(comments) {
  let topLevel = comments.filter(obj => obj.depth === 0);
  const rest = comments.filter(obj => obj.depth > 0);
  topLevel = noname(rest, topLevel, 1);
  return topLevel;
}

const noname = (arr, thisLevel, depth = 0) => {
  if (arr.length === 0) return thisLevel;
  thisLevel.forEach(commentObj => {
    // if (!obj.replies) obj.replies = [];
    commentObj.replies = arr.filter(replyObj => (replyObj.depth === depth) && (replyObj.parent_comment === commentObj._id));
    const rest = arr.filter(obj => obj.depth > depth);
    commentObj.replies = noname(rest, commentObj.replies, depth + 1);
  });
  return thisLevel;
}