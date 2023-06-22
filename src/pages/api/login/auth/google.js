import passport from 'passport'
import { createRouter } from 'next-connect'
import { googleStrategy } from '@/lib/passport-google'

const router = createRouter();

passport.use(googleStrategy)

router
  .use(passport.initialize())
  .get(passport.authenticate('google', { scope: ['profile', 'email'] }))

export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});