import Communities from "@/models/Community";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const communityList = await Communities.find({}, "name _id").exec();
    res.json({ communityList });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}
