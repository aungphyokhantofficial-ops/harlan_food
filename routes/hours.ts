import express from "express";
import { prisma } from "../libs/prisma";
import { auth } from "../middlewears/auth"; // Admin စစ်ရန် middleware

export const router = express.Router();

// ၁။ ဆိုင်ဖွင့်ချိန် အားလုံးကို ကြည့်ရန် (Public - Footer သို့မဟုတ် Contact Page အတွက်)
router.get("/hours", async (req, res) => {
  try {
    const hours = await prisma.hours.findMany({
      orderBy: { id: "asc" }, // နေ့ရက်များအလိုက် စီရန်
    });
    res.status(200).json(hours);
  } catch (error) {
    res.status(500).json({ message: "ဆိုင်ဖွင့်ချိန်များ ဆွဲထုတ်ရာတွင် အမှားရှိနေပါသည်" });
  }
});

// ၂။ အချိန်ဇယားအသစ် ထည့်ရန် (Admin Only)
router.post("/hours", auth, async (req, res) => {
  try {
    const { dayOfWeek, shiftName, openTime, closeTime, isClosed } = req.body;

    const newHour = await prisma.hours.create({
      data: {
        dayOfWeek,
        shiftName,
        openTime,
        closeTime,
        isClosed: isClosed || false,
      },
    });
    res.status(201).json({ message: "အချိန်ဇယားအသစ် ထည့်ပြီးပါပြီ", data: newHour });
  } catch (error) {
    res.status(500).json({ message: "အချိန်ဇယား ထည့်သွင်း၍ မရပါ" });
  }
});

// ၃။ အချိန်ဇယား ပြန်ပြင်ရန် (Admin Only)
// ဥပမာ - ပိတ်ရက်ပြောင်းခြင်း သို့မဟုတ် အချိန်ပြောင်းခြင်း
router.put("/hours/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const updatedHour = await prisma.hours.update({
      where: { id: Number(id) },
      data: req.body,
    });
    res.status(200).json({ message: "အချိန်ဇယား ပြင်ဆင်မှု အောင်မြင်ပါသည်", data: updatedHour });
  } catch (error) {
    res.status(500).json({ message: "ပြင်ဆင်၍ မရပါ" });
  }
});

// ၄။ အချိန်ဇယားကို ဖျက်ထုတ်ရန် (Admin Only)
router.delete("/hours/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.hours.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ message: "အချိန်ဇယားကို ဖျက်ပြီးပါပြီ" });
  } catch (error) {
    res.status(500).json({ message: "ဖျက်ထုတ်၍ မရပါ" });
  }
});
