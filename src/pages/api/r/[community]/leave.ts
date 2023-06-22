import type { NextApiRequest, NextApiResponse } from "next";
import { getLoginSession } from "@/lib/auth";
import Users from "@/models/User";
import Communities from "@/models/Community";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getLoginSession(req);
    if (session) {
      const currentUser = await Users.findById(session.userID).exec();
      const community = await Communities.findOne({
        name: req.query.community,
      }).exec();
      const indexOfCommunity = currentUser.communities.indexOf(community._id);
      if (indexOfCommunity > -1) {
        currentUser.communities.splice(indexOfCommunity, 1);
        community.memberCount -= 1;
        const indexOfModerator = community.moderators.indexOf(currentUser._id);
        if (indexOfModerator > -1) {
          community.moderators.splice(indexOfModerator, 1);
        }
        await Promise.all([currentUser.save(), community.save()]);
      }
      res.status(200).end();
    } else res.status(400).send(`You're not logged in`);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}
