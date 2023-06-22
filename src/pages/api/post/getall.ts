import Posts from "@/models/Post";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY ?? "",
    secretAccessKey: process.env.SECRET_ACCESS_KEY ?? "",
  },
  region: process.env.REGION_NAME,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const posts = await Posts.find({})
    .populate("author", "username")
    .populate("community", "name")
    .sort({ created_at: -1 })
    .exec();
  for (const post of posts) {
    if (post.images && post.images.length > 0) {
      let urlIsOutdated = false;
      for (let imageObj of post.images) {
        if (
          Math.floor(
            (Date.now() - new Date(imageObj.last_updated).getTime()) / 1000
          ) >= 3600
        ) {
          urlIsOutdated = true;
          const getCommand = new GetObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: imageObj.image_name,
          });
          imageObj.url = await getSignedUrl(s3, getCommand, {
            expiresIn: 3600,
          });
          imageObj.last_updated = Date.now();
        }
      }
      if (urlIsOutdated) {
        const outdatedPost = await Posts.findById(post._id).exec();
        outdatedPost.images = Array.from(post.images);
        await outdatedPost.save();
      }
    }
  }
  res.status(200).json({ posts });
}
