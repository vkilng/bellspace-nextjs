export default function mergeCollections(posts, comments) {
  let c1 = 0, c2 = 0;
  let res = [];
  while (c1 < posts.length && c2 < comments.length) {
    if (new Date(posts[c1].created_at) > new Date(comments[c2].created_at)) {
      res.push(posts[c1]);
      c1++;
    } else {
      res.push(comments[c2]);
      c2++;
    }
  }
  console.log(c1, c2);
  res = res.concat(posts.slice(c1));
  res = res.concat(comments.slice(c2));
  return res;
}