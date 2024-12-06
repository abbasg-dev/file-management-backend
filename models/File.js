import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  path: { type: String, required: true },
  tags: [{ type: String }],
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sharedLink: { type: String, default: null },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const File = mongoose.model("File", fileSchema);

export default File;
