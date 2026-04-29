import { prisma } from "../libs/prisma";
import express from "express";
import { auth } from "../middleware/auth";
import multer from "multer";
import path from "path";
import fs from "fs";

export const router = express.Router();

// --- Multer Setup (ပုံများကို server ပေါ်သိမ်းရန်) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/gallery/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // --- Type Check: Image နှင့် Video သာ လက်ခံမည် ---
    const fileTypes = /jpeg|jpg|png|gif|mp4|mov|webm/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("ပုံ သို့မဟုတ် ဗီဒီယို ဖိုင်များသာ တင်ခွင့်ရှိပါသည်။"));
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 }, // Max 50MB (Video ပါနိုင်၍)
});

// --- 2. Admin Route: Direct Upload လုပ်ရန် ---
// POST /api/gallery
// Frontend ကနေ 'file' ဆိုတဲ့ key နဲ့ ပို့ပေးရပါမယ်
router.post("/gallery", auth, upload.single("file"), async (req, res) => {
  try {
    const { title, category } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "ကျေးဇူးပြု၍ ဖိုင်ရွေးချယ်ပေးပါ။" });
    }

    // ဖိုင် extension ကို ကြည့်ပြီး Type သတ်မှတ်ခြင်း
    const isVideo = file.mimetype.startsWith("video");
    const fileType = isVideo ? "VIDEO" : "IMAGE";

    // Database ထဲမှာ URL အစား file path ကို သိမ်းခြင်း
    const newItem = await prisma.galleryItem.create({
      data: {
        title: title || file.originalname,
        type: fileType,
        url: `/uploads/gallery/${file.filename}`, // Browser ကနေ ပြန်ကြည့်မယ့် path
        category: category || "General",
      },
    });

    return res.status(201).json(newItem);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Upload တင်ရာတွင် အမှားရှိနေပါသည်။" });
  }
});

// --- Public Route: Gallery အားလုံးကိုကြည့်ရန် (အရင်အတိုင်း) ---
router.get("/gallery", async (req, res) => {
  try {
    const { category } = req.query;
    const items = await prisma.galleryItem.findMany({
      where: category ? { category: String(category) } : {},
      orderBy: { createdAt: "desc" },
    });
    return res.json(items);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching gallery items" });
  }
});

// ... Delete logic ကိုတော့ အရင်အတိုင်း ထားနိုင်ပါတယ် ...
