import { Schema, model, models } from "mongoose";

const CommentSchema = new Schema({
  created_at: { type: Date, default: Date.now(), required: true },
  updated_at: Date,
  body: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  post: { type: Schema.Types.ObjectId, ref: "Posts", required: true },
  upvotes: { type: Number, default: 0 },
  parent_comment: { type: Schema.Types.ObjectId, ref: "Comments" },
  depth: { type: Number, required: true, default: 0 },
})

export default models?.Comments || model("Comments", CommentSchema);