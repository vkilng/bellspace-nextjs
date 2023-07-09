import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { getNewUsername } from "./helperFunctions";
import Federated_Credentials from "../models/Federated_Credential";
import Users from "../models/User";
// import type { NextApiRequest, NextApiResponse } from "next";
// import type { } from "@types/passport-google-oauth20";

export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://bellspace.vercel.app/api/login/auth/redirect",
    passReqToCallback: true,
  },
  async function verify(
    req,
    accessToken,
    refreshToken,
    profile,
    done
  ) {
    try {
      const requiredCreds = await Federated_Credentials.findOne({
        provider: "https://accounts.google.com",
        subject: profile.id,
      }).exec();
      if (!requiredCreds) {
        try {
          const new_username = await getNewUsername();
          const user_instance = new Users({
            username: new_username,
            email: profile.emails[0].value,
          });
          try {
            await user_instance.save();
            try {
              await Federated_Credentials.create({
                user_id: user_instance._id,
                provider: "https://accounts.google.com",
                subject: profile.id,
              });
              return done(null, { userID: user_instance._id });
            } catch (error) {
              return done(error);
            }
          } catch (error) {
            return done(error);
          }
        } catch (error) {
          return done(error);
        }
      } else {
        try {
          const existingUser = await Users.findById(
            requiredCreds.user_id
          ).exec();
          if (!existingUser) {
            return done(null, false);
          }
          return done(null, { userID: existingUser._id });
        } catch (error) {
          return done(error);
        }
      }
    } catch (error) {
      return done(error);
    }
  }
);
