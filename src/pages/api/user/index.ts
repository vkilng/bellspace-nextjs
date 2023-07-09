import Images from "@/models/Image";
import { getLoginSession } from "@/lib/auth";
import Users from "@/models/User";
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";

export default async function getCurrentUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
  try {
    const session = await getLoginSession(req);
    const user =
      (session &&
        (await Users.findById(session.userID, "-email -password").exec())) ??
      null;
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).end("Authentication token is invalid, please log in");
  }
}
