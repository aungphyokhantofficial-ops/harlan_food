import express from "express";
import { prisma } from "../libs/prisma";
import { auth } from "../middleware/auth";

export const router = express.Router();

// --- Public Route ---
// ၁။ ဆိုင်ဖွင့်ချိန်အားလုံးကို ကြည့်ရန် (Frontend မှာ ပြဖို့)
router.get("/hours", async (req, res) => {
  try {
    const hours = await prisma.openingHour.findMany({
      orderBy: {
        // နေ့ရက်အလိုက် စီချင်ရင် သုံးနိုင်ပါတယ်
        id: "asc",
      },
    });
    res.json(hours);
  } catch (error) {
    res.status(500).json({ message: "Error fetching opening hours" });
  }
});

router.patch("/update", auth, async (req, res) => {
  try {
    const { dayOfWeek, openTime, closeTime, isClosed } = req.body;

    if (!dayOfWeek) {
      return res.status(400).json({
        message: "dayOfWeek is required",
      });
    }

    const updatedHour = await prisma.openingHour.upsert({
      where: { dayOfWeek },
      update: {
        openTime,
        closeTime,
        isClosed,
      },
      create: {
        dayOfWeek,
        openTime,
        closeTime,
        isClosed: isClosed ?? false,
      },
    });

    res.json({
      message: `${dayOfWeek} updated successfully`,
      data: updatedHour,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Update failed",
    });
  }
});
