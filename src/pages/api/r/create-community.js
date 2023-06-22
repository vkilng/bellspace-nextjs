import { createRouter } from "next-connect";
import multer from "multer";
import sharp from "sharp";
import crypto from 'crypto';
import { communityExists } from '@/lib/helperFunctions';
import { getLoginSession } from "@/lib/auth";
import Users from "@/models/User";
import Communities from '@/models/Community';

const router = createRouter();

export const config = {
  api: { bodyParser: false },// Disallow body parsing, consume as stream
};

const runMiddleWare = (req, res, fn) =>
  new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      } else {
        return resolve(result)
      }
    });
  });

router
  .use(async (req, res, next) => {
    try {
      const storage = multer.memoryStorage();
      const upload = multer({ storage: storage });
      await runMiddleWare(req, res, upload.single('community_profile_pic'));
      next();
    } catch (error) {
      res.status(500).json(error.message);
    }
  })
  .post(async (req, res, next) => {
    // validation of user input
    try {
      if (await communityExists(req.body.community_name)) res.status(400).send("Community with that name already exists, try a different one.");
      if (req.body.community_name.match(/([^a-zA-Z_])|^(.{0,3}|.{21,})$/)) res.status(400).send("That community name is invalid. Check out the tooltip.");
      if (!req.body.community_description || req.body.community_description.length < 8) res.status(400).send("Description must be atleast 8 characters long");
    } catch (error) {
      console.error(error)
      res.status(400).send(error.message)
    }
    next();
  })
  .post(async (req, res) => {
    const session = await getLoginSession(req);
    if (session) {
      // const getRandomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');
      const randomImageName = crypto.randomBytes(16).toString('hex');
      await sharp(req.file.buffer).resize({ width: 48, height: 48, fit: 'fill' }).toFile(`uploads/${randomImageName}.png`);
      const newCommunity = new Communities({
        name: req.body.community_name,
        description: req.body.community_description,
        profilepic: randomImageName,
      });
      const currentUser = await Users.findById(session.userID).exec();
      currentUser.communities.push(newCommunity._id);
      newCommunity.moderators.push(currentUser._id);
      await Promise.all([newCommunity.save(), currentUser.save()]);
      // res.redirect(`/r/${req.body.community_name}`);
      res.status(200).send(newCommunity.name);
    }
    // res.redirect('/');
    res.status(400).send(`User is'nt logged in`);
  })

export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
