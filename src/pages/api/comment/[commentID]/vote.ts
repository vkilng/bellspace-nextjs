import type { NextApiRequest, NextApiResponse } from "next";
import { getLoginSession } from "@/lib/auth";
import Comments from "@/models/Comment";
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
      const comment = await Comments.findById(req.query.commentID).exec();

      if (currentVote === null) {
        try {
          const oldCurrentUser = await Users.findByIdAndUpdate(session.userID, {
            $pull: { upvoted: comment._id, downvoted: comment._id },
          });
          if (oldCurrentUser.upvoted.includes(comment._id)) comment.upvotes -= 1;
          else comment.upvotes += 1;
          comment.save();
          res.status(200).send("removed vote");
        } catch (error) {
          res.status(500).send(error);
        }
      }

      if (currentVote === true) {
        try {
          await Users.findByIdAndUpdate(session.userID, {
            $push: { upvoted: new mongoose.Types.ObjectId(comment._id) },
            $pull: { downvoted: comment._id },
          });
          comment.upvotes += 1;
          comment.save();
          res.status(200).send("upvoted");
        } catch (error) {
          res.status(500).send(error);
        }
      }

      if (currentVote === false) {
        try {
          await Users.findByIdAndUpdate(session.userID, {
            $push: { downvoted: comment._id },
            $pull: { upvoted: comment._id },
          });
          comment.upvotes -= 1;
          comment.save();
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
