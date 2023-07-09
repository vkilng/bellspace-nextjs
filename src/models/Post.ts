import { Schema, model, models } from "mongoose";
import Images from "@/models/Image";
import Communities from "@/models/Community";
import Users from "@/models/User";

const PostSchema = new Schema({
  created_at: { type: Date, default: Date.now(), required: true },
  updated_at: Date,
  title: { type: String, required: true },
  body: String,
  images: [{ type: Schema.Types.ObjectId, ref: Images, default: null }],
  author: { type: Schema.Types.ObjectId, ref: Users, required: true },
  community: { type: Schema.Types.ObjectId, ref: Communities },
  commentCount: { type: Number, default: 0 },
  upvotes: { type: Number, default: 0 },
});

export default models?.Posts || model("Posts", PostSchema);
