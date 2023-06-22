import type { NextApiRequest, NextApiResponse } from "next";
import { getLoginSession } from "@/lib/auth";
import Users from "@/models/User";
import mongoose from "mongoose";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getLoginSession(req);
    if (session && typeof req.query.postID === "string") {
      const currentUser = await Users.findById(session.userID).exec();
      if (currentUser.saved.includes(req.query.postID)) {
        await Users.findByIdAndUpdate(session.userID, {
          $pull: { saved: new mongoose.Types.ObjectId(req.query.postID) },
        });
        res.status(200).send("save successful");
      } else {
        await Users.findByIdAndUpdate(session.userID, {
          $push: { saved: new mongoose.Types.ObjectId(req.query.postID) },
        });
        res.status(200).send("unsave successful");
      }
      res.status(500).end();
    } else res.status(400).send(`User isn't logged in`);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}
