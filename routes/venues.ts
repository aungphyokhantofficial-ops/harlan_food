import express from "express";
import { prisma } from "../libs/prisma";
import { auth } from "../middlewears/auth";

export const router = express.Router();

// GET ALL
router.get("/venues", async (req, res) => {
  try {
    const venues = await prisma.venue.findMany({
      orderBy: { id: "asc" },
    });
    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ message: "Data ဆွဲထုတ်ရာတွင် အမှားရှိနေပါသည်" });
  }
});

// CREATE
router.post("/venues", auth, async (req, res) => {
  try {
    const { name, slug, description, capacity, image } = req.body;
    const newVenue = await prisma.venue.create({
      data: {
        name,
        slug,
        description,
        capacity: Number(capacity),
        image,
      },
    });
    res.status(201).json({ message: "Venue အသစ်ထည့်ပြီးပါပြီ", data: newVenue });
  } catch (error) {
    res.status(500).json({ message: "Data ထည့်သွင်း၍ မရပါ (Slug တူနေခြင်း ဖြစ်နိုင်ပါသည်)" });
  }
});

// UPDATE
router.put("/venues/:id", auth, async (req, res) => {
  const { id } = req.params;
  // id ပါလာရင် ဖယ်ထုတ်ဖို့အတွက် Destructuring သုံးမယ်
  const { id: bodyId, ...updateData } = req.body;

  try {
    const updatedVenue = await prisma.venue.update({
      where: { id: Number(id) },
      data: {
        ...updateData,
        capacity: updateData.capacity ? Number(updateData.capacity) : undefined,
      },
    });
    res.status(200).json({ message: "ပြင်ဆင်မှု အောင်မြင်ပါသည်", data: updatedVenue });
  } catch (error) {
    res.status(500).json({ message: "ပြင်ဆင်၍ မရပါ (ID မရှိခြင်း သို့မဟုတ် Data မှားယွင်းခြင်း)" });
  }
});

// DELETE
router.delete("/venues/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.venue.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ message: "ဖျက်ထုတ်ပြီးပါပြီ" });
  } catch (error) {
    res.status(500).json({ message: "ဖျက်ထုတ်၍ မရပါ" });
  }
});
