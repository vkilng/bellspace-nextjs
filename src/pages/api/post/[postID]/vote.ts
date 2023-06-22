import type { NextApiRequest, NextApiResponse } from "next";
import { getLoginSession } from "@/lib/auth";
import Posts from "@/models/Post";
import Users from "@/models/User";
import mongoose from "mongoose";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getLoginSession(req);
    if (session) {
      const { currentVote } = req.body;
      const post = await Posts.findById(req.query.postID).exec();

      if (currentVote === null) {
        try {
          const oldCurrentUser = await Users.findByIdAndUpdate(session.userID, {
            $pull: { upvoted: post._id, downvoted: post._id },
          });
          if (oldCurrentUser.upvoted.includes(post._id)) post.upvotes -= 1;
          else post.upvotes += 1;
          post.save();
          res.status(200).send("removed vote");
        } catch (error) {
          res.status(500).send(error);
        }
      }

      if (currentVote === true) {
        try {
          await Users.findByIdAndUpdate(session.userID, {
            $push: { upvoted: new mongoose.Types.ObjectId(post._id) },
            $pull: { downvoted: post._id },
          });
          post.upvotes += 1;
          post.save();
          res.status(200).send("upvoted");
        } catch (error) {
          res.status(500).send(error);
        }
      }

      if (currentVote === false) {
        try {
          await Users.findByIdAndUpdate(session.userID, {
            $push: { downvoted: post._id },
            $pull: { upvoted: post._id },
          });
          post.upvotes -= 1;
          post.save();
          res.status(200).send("downvoted");
        } catch (error) {
          res.status(500).send(error);
        }
      }

      res.status(400).end();
    } else {
      res.status(400).send(`User isn't logged in`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}
