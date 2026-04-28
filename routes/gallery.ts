import express from "express";
import { prisma } from "../libs/prisma";
import { auth } from "../middlewears/auth"; // Admin စစ်ရန်

export const router = express.Router();

// ၁။ Gallery ပုံအားလုံးကို ကြည့်ရန် (Public - Gallery Page အတွက်)
router.get("/gallery", async (req, res) => {
  try {
    const { category } = req.query; // Category အလိုက် filter လုပ်ချင်ရင် (optional)

    const images = await prisma.gallery.findMany({
      where: category ? { category: String(category) } : {},
      orderBy: { id: "desc" }, // နောက်ဆုံးတင်တဲ့ပုံ အရင်ပြမယ်
    });
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: "ပုံများ ဆွဲထုတ်ရာတွင် အမှားရှိနေပါသည်" });
  }
});

// ၂။ ပုံအသစ်တင်ရန် (Admin Only)
router.post("/gallery", auth, async (req, res) => {
  try {
    const { imageUrl, category, caption } = req.body;

    if (!imageUrl || !category) {
      return res.status(400).json({ message: "ImageUrl နှင့် Category လိုအပ်ပါသည်" });
    }

    const newItem = await prisma.gallery.create({
      data: { imageUrl, category, caption },
    });
    res.status(201).json({ message: "Gallery ထဲသို့ ပုံထည့်ပြီးပါပြီ", data: newItem });
  } catch (error) {
    res.status(500).json({ message: "ပုံသိမ်းဆည်း၍ မရပါ" });
  }
});

// ၃။ ပုံ၏ Caption သို့မဟုတ် Category ကို ပြန်ပြင်ရန် (Admin Only)
router.put("/gallery/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const updatedGallery = await prisma.gallery.update({
      where: { id: Number(id) },
      data: req.body,
    });
    res.status(200).json({ message: "ပြင်ဆင်မှု အောင်မြင်ပါသည်", data: updatedGallery });
  } catch (error) {
    res.status(500).json({ message: "ပြင်ဆင်၍ မရပါ" });
  }
});

// ၄။ Gallery မှ ပုံကို ဖျက်ထုတ်ရန် (Admin Only)
router.delete("/gallery/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.gallery.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ message: "ပုံကို ဖျက်ပြီးပါပြီ" });
  } catch (error) {
    res.status(500).json({ message: "ဖျက်ထုတ်၍ မရပါ" });
  }
});
