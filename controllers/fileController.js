import path from "path";
import asyncHandler from "express-async-handler";
import File from "../models/File.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

const uploadFile = [
  upload.single("file"),
  asyncHandler(async (req, res) => {
    const { tags } = req.body;

    const file = await File.create({
      filename: req.file.originalname,
      path: req.file.filename,
      tags: tags ? tags.split(",") : [],
      uploadedBy: req.user.id,
    });

    res.status(201).json(file);
  }),
];

const getFiles = asyncHandler(async (req, res) => {
  try {
    const files = await File.find();
    res.status(200).json(files);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching files", error: err.message });
  }
});

const shareFile = asyncHandler(async (req, res) => {
  const { fileId } = req.params;

  const file = await File.findById(fileId);
  if (!file) {
    res.status(404);
    throw new Error("File not found");
  }

  if (file.uploadedBy.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Unauthorized");
  }

  if (!file.sharedLink) {
    file.sharedLink = `${req.protocol}://${req.get("host")}/api/files/view/${
      file._id
    }`;
    await file.save();
  }

  res.status(200).json({ sharedLink: file.sharedLink });
});

const incrementFileViews = asyncHandler(async (req, res) => {
  const { fileId } = req.params;

  const file = await File.findById(fileId);
  if (!file) {
    res.status(404);
    throw new Error("File not found");
  }

  file.views += 1;
  await file.save();

  const filePath = path.resolve(`uploads/${file.path}`);

  const fileUrl = `/uploads/${file.path}`;

  res.json({ fileUrl });
});

const getFileStats = asyncHandler(async (req, res) => {
  const { fileId } = req.params;

  const file = await File.findById(fileId);
  if (!file) {
    res.status(404);
    throw new Error("File not found");
  }

  if (file.uploadedBy.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Unauthorized");
  }

  res.status(200).json({
    filename: file.filename,
    views: file.views,
    uploadedAt: file.createdAt,
    tags: file.tags,
  });
});

export { uploadFile, getFiles, shareFile, incrementFileViews, getFileStats };
