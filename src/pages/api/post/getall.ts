import Posts from "@/models/Post";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const posts = await Posts.find({})
    .populate("author", "username")
    .populate("community", "name")
    .populate("images")
    .sort({ created_at: -1 })
    .exec();

  res.status(200).json({ posts });
}
