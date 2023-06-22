import passport from 'passport'
import { createRouter, expressWrapper } from 'next-connect'
import { localStrategy } from '@/lib/passport-local'
import { setLoginSession } from '@/lib/auth'

const router = createRouter();

const authenticate = (method, req, res) =>
  new Promise((resolve, reject) => {
    passport.authenticate(method, { session: false }, (error, token) => {
      if (error) {
        reject(error)
      } else {
        resolve(token)
      }
    })(req, res)
  })

passport.use(localStrategy)

router
  .use(expressWrapper(passport.initialize()))
  .post(async (req, res) => {
    try {
      const userID = await authenticate('local', req, res)
      // session is the payload to save in the token, it may contain basic info about the user
      const session = { userID }

      await setLoginSession(res, session)

      res.status(200).send({ done: true })
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