import { Schema, model, models } from "mongoose";

const CommunitySchema = new Schema({
  created_at: { type: Date, default: Date.now(), required: true },
  updated_at: Date,
  name: { type: String, minLength: 1, maxLength: 21, required: true },
  description: { type: String, minLength: 1 },
  rules: [{ type: String, default: null }],
  profilepic: { type: Schema.Types.ObjectId, ref: "Images", required: true },
  memberCount: { type: Number, default: 1 },
  moderators: [{ type: Schema.Types.ObjectId, ref: "Users", default: null }],
});

export default models?.Communities || model("Communities", CommunitySchema);
