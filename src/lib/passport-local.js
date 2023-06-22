const LocalStrategy = require('passport-local');
import bcrypt from 'bcryptjs';
import Users from '../models/User';

export const localStrategy = new LocalStrategy(async function verify(username, password, done) {
  try {
    const existingUser = await Users.findOne({ username: username }).exec();
    if (existingUser) {
      bcrypt.compare(password, existingUser.password, (err, res) => {
        if (err) done(err);
        if (res) {
          // const { _id, ...rest } = existingUser;
          done(null, existingUser._id);
        }
        else done(new Error('Password is incorrect'));
      })
    } else {
      done(new Error('Username is incorrect'));
    }
  } catch (err) {
    return done(err);
  };
})