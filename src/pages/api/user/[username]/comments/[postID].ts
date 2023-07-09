import type { NextApiRequest, NextApiResponse } from "next";
import Users from "@/models/User";
import Posts from "@/models/Post";
import Comments from "@/models/Comment";
import { getLoginSession } from "@/lib/auth";
import mongoose from "mongoose";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const requestedUser = await Users.findOne(
        { username: req.query.username },
        "-email -password"
      ).exec();
      if (requestedUser) {
        const post = await Posts.findById(req.query.postID)
          .populate("author", "username")
          .populate("community", "name")
          .populate("images")
          .exec();
        const comments = await Comments.find({ post: post._id })
          .populate("author", "username profile_pic_url")
          .sort({ created_at: -1 })
          .exec();
        res.status(200).json({ requestedUser, post, comments });
      } else {
        res
          .status(400)
          .send("Either the username is incorrect or this post does not exist");
      }
    }
    if (req.method === "POST") {
      if (req.body.comment_content.length === "")
        res.status(400).send("comment cannot be empty");

      const session = await getLoginSession(req);
      if (session && typeof req.query.postID === "string") {
        const currentUser = await Users.findById(session.userID).exec();
        const post = await Posts.findById(req.query.postID).exec();
        const new_comment = new Comments({
          body: req.body.comment_content,
          author: currentUser._id,
          post: post._id,
        });
        if (req.body.parent_comment)
          new_comment.parent_comment = new mongoose.Types.ObjectId(
            req.body.parent_comment
          );
        if (req.body.depth) new_comment.depth = req.body.depth;
        post.commentCount += 1;
        await Promise.all([new_comment.save(), post.save()]);
        res.status(200).send({ new_comment });
      } else {
        res.status(400).send(`User isn't logged in`);
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}
