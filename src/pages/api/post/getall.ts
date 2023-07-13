import Posts from "@/models/Post";
import Communities from "@/models/Community";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const posts = await Posts.find({})
    .populate("author", "username")
    .populate("community", "name profilepic")
    .populate("images")
    .sort({ created_at: -1 })
    .exec();

  res.status(200).json({ posts });
}
