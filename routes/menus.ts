// controllers/categoryController.js
import { prisma } from "../libs/prisma";
import express from "express";

export const router = express.Router();

// --- Public Route ---

// 1. GET ALL (Filter by type - e.g., ?type=Daily)
// GET: http://localhost:5000/api/categories?type=Daily

router.get("/categories", async (req, res) => {
  try {
    // ၁. Postman ရဲ့ Params tab ကနေ 'menuType' ဆိုတဲ့ နာမည်နဲ့ ပို့တာကို ဖတ်မယ်
    const filterType = req.query.menuType;

    console.log(filterType); // Terminal မှာ Daily/Morning တက်လာလား ကြည့်ပါ

    const categories = await prisma.menuCategory.findMany({
      where: {
        // filterType မှာ တန်ဖိုးရှိမှသာ where အလုပ်လုပ်အောင် ရေးထားပါတယ်
        menuType: filterType ? String(filterType) : undefined,
      },
      include: {
        items: true,
      },
    });

    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// 2. CREATE (New Category)
router.post("/categories", async (req, res) => {
  try {
    const { name, menuType, image } = req.body;
    const newCategory = await prisma.menuCategory.create({
      data: { name, menuType, image },
    });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ error: "Create failed" });
  }
});

// 3. UPDATE (Category by ID)
router.put("/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, menuType, image } = req.body;
    const updated = await prisma.menuCategory.update({
      where: { id: Number(id) },
      data: { name, menuType, image },
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: "Update failed" });
  }
});

// 4. DELETE (Category by ID)
router.delete("/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.menuCategory.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Delete failed" });
  }
});

/**
 * 1. GET - Fetch Categories & Items by Type
 * GET: /api/menu?type=Daily
 */
router.get("/menu", async (req, res) => {
  try {
    const { type } = req.query;

    const data = await prisma.menuCategory.findMany({
      where: {
        ...(type ? { menuType: String(type) } : {}),
      },
      include: {
        items: true, // ✅ Category နဲ့အတူ Items data တွေပါ တစ်ခါတည်း ပါလာအောင် include သုံးပါတယ်
      },
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Data ဆွဲယူရာတွင် အမှားအယွင်းရှိပါသည်။" });
  }
});

/**
 * 2. POST - Create Category or Item
 * POST: /api/menu
 */
router.post("/menu", async (req, res) => {
  try {
    const { target, ...payload } = req.body; // target: 'category' or 'item'

    if (target === "category") {
      const category = await prisma.menuCategory.create({
        data: {
          name: payload.name,
          menuType: payload.menuType,
          image: payload.image,
        },
      });
      return res.status(201).json(category);
    }

    if (target === "item") {
      const item = await prisma.menuItem.create({
        data: {
          name: payload.name,
          price: Number(payload.price),
          description: payload.description,
          image: payload.image,
          menuCategoryId: Number(payload.menuCategoryId),
        },
      });
      return res.status(201).json(item);
    }

    res.status(400).json({ error: "Invalid target. Use 'category' or 'item'." });
  } catch (error) {
    res.status(400).json({ error: "Creation failed" });
  }
});

// ---------------------------------------------------------
// 1. GET ALL ITEMS (With Filter & Search)
// GET: /api/items?name=Mohinga
// ---------------------------------------------------------
router.get("/items", async (req, res) => {
  try {
    const { name, available } = req.query;

    const items = await prisma.menuItem.findMany({
      where: {
        // နာမည်နဲ့ ရှာချင်ရင် (Case-insensitive)
        ...(name ? { name: { contains: String(name) } } : {}),
        // ရနိုင်တဲ့ item တွေပဲ ကြည့်ချင်ရင်
        ...(available ? { isAvailable: available === "true" } : {}),
      },
      include: {
        menuCategory: true, // ဘယ် Category အောက်ကလဲဆိုတာ သိရအောင်
      },
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Items ဆွဲယူရာတွင် အမှားအယွင်းရှိပါသည်။" });
  }
});

// ---------------------------------------------------------
// 2. GET SINGLE ITEM (By ID)
// ---------------------------------------------------------
router.get("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const item = await prisma.menuItem.findUnique({
      where: { id: Number(id) },
      include: { menuCategory: true },
    });

    if (!item) return res.status(404).json({ error: "Item မတွေ့ပါ။" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Error fetching item" });
  }
});

// ---------------------------------------------------------
// 3. CREATE ITEM
// ---------------------------------------------------------
router.post("/items", async (req, res) => {
  try {
    const { name, price, description, image, menuCategoryId } = req.body;

    const newItem = await prisma.menuItem.create({
      data: {
        name,
        price: Number(price),
        description,
        image,
        menuCategoryId: Number(menuCategoryId),
      },
    });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ error: "Item အသစ်ထည့်၍ မရပါ။" });
  }
});

// ---------------------------------------------------------
// 4. UPDATE ITEM
// ---------------------------------------------------------
router.put("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, image, isAvailable } = req.body;

    const updatedItem = await prisma.menuItem.update({
      where: { id: Number(id) },
      data: {
        name,
        price: price ? Number(price) : undefined,
        description,
        image,
        isAvailable,
      },
    });
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ error: "Update လုပ်၍ မရပါ။" });
  }
});

// ---------------------------------------------------------
// 5. DELETE ITEM
// ---------------------------------------------------------
router.delete("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.menuItem.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Item ကို ဖျက်ပြီးပါပြီ။" });
  } catch (error) {
    res.status(400).json({ error: "ဖျက်၍ မရပါ။" });
  }
});
