import Users from "@/models/User";
import Posts from "@/models/Post";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const requestedUser = await Users.findOne(
      {
        username: req.query.username,
      },
      "-email -password"
    ).exec();
    if (requestedUser) {
      const posts = await Posts.find({ author: requestedUser._id })
        .populate("author", "username")
        .populate("community", "name")
        .populate("images")
        .sort({ created_at: -1 })
        .exec();
      res.status(200).json({ requestedUser, posts });
    } else res.status(400).send("User not found");
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}
