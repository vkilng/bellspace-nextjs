import type { NextApiRequest, NextApiResponse } from "next";
import { getLoginSession } from "@/lib/auth";
import Users from "@/models/User";
import Posts from "@/models/Post";
import Images from "@/models/Image";
import mongoose from "mongoose";
import multer from "multer";
import sharp from "sharp";
import crypto from "crypto";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY ?? "",
    secretAccessKey: process.env.SECRET_ACCESS_KEY ?? "",
  },
  region: process.env.REGION_NAME,
});

export const config = {
  api: { bodyParser: false }, // Disallow body parsing, consume as stream
};

const runMiddleWare = (req: any, res: any, fn: any) =>
  new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      } else {
        return resolve(result);
      }
    });
  });

export default async function handler(req: any, res: NextApiResponse) {
  try {
    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage });
    await runMiddleWare(req, res, upload.array("imageFiles"));

    if (req.body.post_title.length === "")
      res.status(400).send("Post title cannot be empty");
    if (!req.body.community_id)
      res.status(400).send("Community does not exist");

    const session = await getLoginSession(req);
    if (session) {
      const currentUser = await Users.findById(session.userID);
      if (!currentUser.communities.includes(req.body.community_id))
        res.status(400).send("User not a member of this community");

      const new_post = new Posts({
        created_at:Date.now(),
        title: req.body.post_title,
        body: req.body.post_content,
        author: currentUser._id,
        community: new mongoose.Types.ObjectId(req.body.community_id),
      });

      /* Image File handlers */
      const imagesList = [];
      if (req.files.length > 0) {
        for (const file of req.files) {
          const randomImageName = crypto.randomBytes(16).toString("hex");
          const modifiedImageBuffer = await sharp(file.buffer)
            .resize({ width: 720, fit: "contain" })
            .toBuffer();
          // Post image to S3 bucket
          const postCommand = new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: randomImageName,
            Body: modifiedImageBuffer,
            ContentType: file.mimetype,
          });
          // Push image info to mongoDB
          const new_image = new Images({ file_name: randomImageName });
          await Promise.all([s3.send(postCommand), new_image.save()]);
          imagesList.push(new_image._id);
        }
        new_post.images = imagesList;
      }

      await new_post.save();
      res.status(200).send("Create post successful");
    } else {
      res.status(400).send(`User isn't logged in`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}
