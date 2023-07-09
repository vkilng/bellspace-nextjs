import { Schema, model, models } from "mongoose";

const Federated_CredentialSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  provider: {
    type: String,
    enum: ["https://accounts.google.com", "https://www.facebook.com"],
  },
  subject: { type: String, required: true },
});

const Federated_Credentials =
  models?.Federated_Credentials ||
  model("Federated_Credentials", Federated_CredentialSchema);

export default models?.Federated_Credentials ||
  model("Federated_Credentials", Federated_CredentialSchema);
