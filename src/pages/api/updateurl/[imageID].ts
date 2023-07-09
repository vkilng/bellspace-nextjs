import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { NextApiRequest, NextApiResponse } from "next";
import Images from "@/models/Image";

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
  try {
    const image = await Images.findById(req.query.imageID).exec();
    // Get image url from S3 bucket
    const getCommand = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: image.file_name,
    });
    image.url = await getSignedUrl(s3, getCommand, {
      expiresIn: 24 * 60 * 60,
    });
    image.updated_at = Date.now();
    image.expires_at = Date.now() + 24 * 60 * 60 * 1000;

    await image.save();
    res.status(200).send(image.url);
  } catch (error) {
    console.error(error);
    res.status(500).send("some error");
  }
}
