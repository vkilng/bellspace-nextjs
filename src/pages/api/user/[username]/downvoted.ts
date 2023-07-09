import { getLoginSession } from "@/lib/auth";
import Users from "@/models/User";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getLoginSession(req);
    if (!session?.userID) res.status(400).send('You are not logged in');
    const requestedUser = await Users.findOne(
      {
        username: req.query.username,
      },
      "-email -password"
    )
      .populate({
        path: "downvoted",
        populate: [
          { path: "author", select: "username" },
          { path: "community", select: "name" },
          { path: "images"},
        ],
        options: { sort: { created_at: -1 } },
      })
      .exec();
    if (requestedUser) {
      res.status(200).json({ requestedUser, posts: requestedUser.downvoted });
    } else res.status(400).send("User not found");
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}
