import { Schema, model, models } from "mongoose";

const ImageSchema = new Schema({
  file_name: { type: String, required: true },
  url: { type: String },
  updated_at: { type: Date, default: Date.now(), required: true },
  expires_at: {
    type: Date,
    default: Date.now() + 24 * 60 * 60 * 1000,
    required: true,
  },
});

export default models?.Images || model("Images", ImageSchema);
