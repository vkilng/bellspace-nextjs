import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: null },
  username: { type: String, minLength: 1, maxLength: 20, required: true },
  email: String,
  password: String,
  profile_pic_url: { type: String, default: null },
  communities: [{ type: Schema.Types.ObjectId, ref: "Communities", default: null }],
  upvoted: [{ type: Schema.Types.ObjectId, ref: "Posts", default: null }],
  downvoted: [{ type: Schema.Types.ObjectId, ref: "Posts", default: null }],
  pinned: [{ type: Schema.Types.ObjectId, ref: "Posts", default: null }],
  saved: [{ type: Schema.Types.ObjectId, ref: "Posts", default: null }],
});

export default models?.Users || model("Users", UserSchema);