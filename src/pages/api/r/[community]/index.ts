import Communities from "@/models/Community";
import Posts from "@/models/Post";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const community = await Communities.findOne({
      name: req.query.community,
    }).exec();
    if (community) {
      const posts = await Posts.find({ community: community._id })
        .populate('author', 'username')
        .populate('community','name')
        .exec();
      res.status(200).json({ community, posts });
    } else res.status(400).send("Community not found");
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}
