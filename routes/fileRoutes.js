import express from "express";
const router = express.Router();

import {
  uploadFile,
  getFiles,
  shareFile,
  incrementFileViews,
  getFileStats,
} from "../controllers/fileController.js";

import { authMiddleware } from "../middlewares/auth.js";

// Protected routes
router.post("/upload", authMiddleware, uploadFile);
router.get("/", getFiles);
router.get("/share/:fileId", authMiddleware, shareFile);

// Public route to view a file and track views
router.get("/view/:fileId", incrementFileViews);
router.get("/stats/:fileId", authMiddleware, getFileStats);

export default router;
