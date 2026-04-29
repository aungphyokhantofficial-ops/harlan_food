//

import { prisma } from "../libs/prisma";
import express from "express";
import { auth } from "../middleware/auth";

export const router = express.Router();

// --- Admin Route
router.post("/categories", async (req, res) => {
  try {
    const { name, menuType } = req.body;
    const category = await prisma.menuCategory.create({
      data: {
        name,
        menuType, // "Daily", "Tasting", "Sunday" စသည်ဖြင့်
      },
    });
    return res.status(201).json(category);
  } catch (error) {
    return res.status(500).json({ message: "Error creating category" });
  }
});

// Category ပြင်ခြင်း
router.put("/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, menuType } = req.body;
    const updatedCategory = await prisma.menuCategory.update({
      where: { id: Number(id) },
      data: {
        name,
        menuType,
      },
    });
    return res.json(updatedCategory);
  } catch (error) {
    return res.status(500).json({ message: "Error updating category" });
  }
});

// --- Item Section ---

// Item အသစ်ထည့်ခြင်း
router.post("/items", async (req, res) => {
  try {
    const { name, price, menuCategoryId } = req.body;
    const item = await prisma.menuItem.create({
      data: {
        name,
        price: Number(price),
        categoryId: Number(menuCategoryId),
      },
    });
    return res.status(201).json(item);
  } catch (error) {
    return res.status(500).json({ message: "Error creating item" });
  }
});

// Item ပြင်ခြင်း
router.put("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, menuCategoryId } = req.body;
    const updatedItem = await prisma.menuItem.update({
      where: { id: Number(id) },
      data: {
        name,
        price: price ? Number(price) : undefined,
        categoryId: menuCategoryId ? Number(menuCategoryId) : undefined,
      },
    });
    return res.json(updatedItem);
  } catch (error) {
    return res.status(500).json({ message: "Error updating item" });
  }
});

// --- Delete Section ---

// Category သို့မဟုတ် Item ဖျက်ရန်
router.delete("/:type/:id", async (req, res) => {
  const { type, id } = req.params; // type: 'categories' သို့မဟုတ် 'items'
  try {
    if (type === "categories") {
      await prisma.menuCategory.delete({ where: { id: Number(id) } });
    } else if (type === "items") {
      await prisma.menuItem.delete({ where: { id: Number(id) } });
    } else {
      return res.status(400).json({ message: "Invalid delete type" });
    }
    return res.json({ message: "Deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting record" });
  }
});
