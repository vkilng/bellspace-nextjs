import { createRouter, expressWrapper } from 'next-connect';
import { setLoginSession } from '@/lib/auth';
import { usernameExists } from '@/lib/helperFunctions';
import bcrypt from 'bcryptjs';
import isEmail from "validator/lib/isemail";
import Users from '@/models/User';

const router = createRouter();

router
  .use(async (req, res, next) => {
    try {
      if (!isEmail(req.body.email)) res.status(400).json({ errorMsg: 'That email is not valid' });
      if (req.body.password.length < 8) res.status(400).json({ errorMsg: 'Password must be atleast 8 characters long' });
      if (await usernameExists(req.body.username)) res.status(400).json({ errorMsg: 'That username is taken, try a different one' });
      if (req.body.username.match(/^(?!.{3,20}$)[^A-Za-z0-9\-_]+$/g)) {
        res.status(400).json({ errorMsg: 'Letters, numbers, dashes, and underscores only. Please try again without symbols. Username must be between 3 and 20 characters.' });
      }
      next();
    } catch (error) {
      console.error(error)
      res.status(401).send(error.message)
    }
  })
  .post(async (req, res) => {
    try {
      const newUser = new Users({
        username: req.body.username,
        email: req.body.email,
      });
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
          next(err);
        } else {
          newUser.password = hashedPassword;
          await newUser.save();
          await setLoginSession(res, { userID: newUser._id })
          res.redirect('/')
        }
      })
    } catch (error) {
      console.error(error)
      res.status(401).send(error.message)
    }
  })

export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});