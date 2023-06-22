// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { usernameExists } from "@/lib/helperFunctions";

export default async function checkingForUsername(
  req: NextApiRequest,
  res: NextApiResponse<{ res: boolean }>
) {
  res.json({ res: await usernameExists(req.query.username) });
}
