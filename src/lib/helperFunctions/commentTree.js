export default function commentTree(comments) {
  let topLevel = comments.filter(obj => obj.depth === 0);
  const rest = comments.filter(obj => obj.depth > 0);
  topLevel = populate(rest, topLevel, 1);
  return topLevel;
}

const populate = (rest, thisLevel, depth = 1) => {
  if (rest.length === 0) return thisLevel;
  thisLevel.forEach(comment => {
    const repliesToComment = rest.filter(replyObj => (replyObj.parent_comment === comment._id));
    const nextRest = rest.filter(obj => obj.depth > depth);
    comment.replies = populate(nextRest, repliesToComment, depth + 1);
  });
  return thisLevel;
}