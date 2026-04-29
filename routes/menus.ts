// controllers/categoryController.js
import { prisma } from "../libs/prisma";
import express from "express";

export const router = express.Router();

// --- Public Route ---

// 1. Categories အားလုံးကို ယူတဲ့ Route
router.get("/categories", async (req, res) => {
  try {
    const categories = await prisma.menuCategory.findMany({
      orderBy: { id: "asc" },
      // Category နဲ့အတူ ၎င်းအောက်မှာရှိတဲ့ items တွေကိုပါ တစ်ခါတည်း သိချင်ရင် include ကို သုံးပါ
      // ဒါပေမယ့် item အများကြီးရှိရင် include မသုံးဘဲ /items route ကိုပဲ သီးသန့်ခေါ်တာ ပိုမြန်ပါတယ်
      include: {
        items: true,
      },
    });
    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching categories" });
  }
});

// 3. Category တစ်ခုတည်းကိုပဲ ယူမယ့် Route (ဒါလေး ထပ်ထည့်ပေးပါ)
router.get("/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const category = await prisma.menuCategory.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        items: true, // category နဲ့အတူ items တွေကိုပါ တစ်ခါတည်း ပြချင်ရင်
      },
    });

    if (!category) {
      return res.status(404).json({ message: "Category မတွေ့ပါ" });
    }

    return res.json(category);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching category" });
  }
});

// 2. Items တွေကို Category အလိုက် Filter လုပ်ပြီး ယူမယ့် Route
// GET /categories/:id/items
// ဥပမာ - /categories/5/items လို့ ခေါ်ရင် ID 5 ဖြစ်တဲ့ category အောက်က items တွေပဲ ကျလာမယ်

router.get("/categories/:id/items", async (req, res) => {
  try {
    const { id } = req.params; // URL path ထဲက id ကို ယူတာပါ (:id)

    const items = await prisma.menuItem.findMany({
      where: {
        categoryId: Number(id), // path ကလာတဲ့ id နဲ့ filter လုပ်မယ်
      },
      orderBy: {
        id: "asc",
      },
    });

    if (items.length === 0) {
      return res.status(404).json({ message: "ဤ category အောက်တွင် menu မရှိသေးပါ" });
    }

    return res.json(items);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching items for this category" });
  }
});
