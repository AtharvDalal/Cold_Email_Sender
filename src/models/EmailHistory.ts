import mongoose from "mongoose";

const EmailHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  hrEmail: { type: String, required: true },
  fullname: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
});

export default mongoose.models.EmailHistory ||
  mongoose.model("EmailHistory", EmailHistorySchema);
