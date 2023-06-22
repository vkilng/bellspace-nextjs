import passport from 'passport'
import { createRouter } from 'next-connect';
import { setLoginSession } from '@/lib/auth';

const router = createRouter();

router
  .get(passport.authenticate('google', { session: false }))
  .use(async (req, res) => {
    const session = { ...req.user };
    await setLoginSession(res, session);

    res.redirect('/');
  })

export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});