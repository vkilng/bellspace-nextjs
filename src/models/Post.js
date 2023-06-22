import { Schema, model, models } from "mongoose";

const PostSchema = new Schema({
  created_at: { type: Date, default: Date.now(), required: true },
  updated_at: Date,
  title: { type: String, required: true },
  body: String,
  images: {
    type: [{
      image_name: { type: String, required: true },
      url: { type: String, default: '' },
      last_updated: { type: Date, required: true }
    }],
    default: null,
  },
  author: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  community: { type: Schema.Types.ObjectId, ref: "Communities" },
  commentCount: { type: Number, default: 0 },
  upvotes: { type: Number, default: 0 },
})

export default models?.Posts || model("Posts", PostSchema);