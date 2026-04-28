import express from "express";
import { prisma } from "../libs/prisma";
import { auth } from "../middlewears/auth";

export const router = express.Router();

// ၁။ Customer များ Inquiry/Reservation လုပ်ရန် (Public - Token မလိုပါ)
router.post("/inquiries", async (req, res) => {
  try {
    const { type, name, email, phone, eventDate, guestCount, message, venueId } = req.body;

    const newInquiry = await prisma.inquiry.create({
      data: {
        type, // "RESERVATION" သို့မဟုတ် "EVENT"
        name,
        email,
        phone,
        eventDate: new Date(eventDate),
        guestCount: Number(guestCount),
        message,
        venueId: venueId ? Number(venueId) : null,
        status: "PENDING", // အသစ်ဝင်လာရင် အမြဲ Pending
      },
    });

    res.status(201).json({ message: "Inquiry ပို့လွှတ်မှု အောင်မြင်ပါသည်", data: newInquiry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Inquiry ပို့ရန် အမှားရှိနေပါသည်" });
  }
});

// ၂။ Admin မှ Inquiry အားလုံးကို ပြန်ကြည့်ရန် (Admin Only - Token လိုအပ်သည်)
router.get("/inquiries", auth, async (req, res) => {
  try {
    const inquiries = await prisma.inquiry.findMany({
      include: {
        venue: true, // ဘယ်နေရာမှာ ပွဲလုပ်ချင်လဲဆိုတာပါ သိရအောင် Venue ပါ ယူမယ်
      },
      orderBy: {
        createdAt: "desc", // အသစ်ဆုံးကို အပေါ်ကပြမယ်
      },
    });
    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({ message: "Data ဆွဲထုတ်၍ မရပါ" });
  }
});

// ၃။ Admin မှ Status ပြောင်းရန် (ဥပမာ- PENDING မှ CONFIRMED ပြောင်းခြင်း)
router.patch("/inquiries/:id/status", auth, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // "CONFIRMED", "CANCELLED"

  try {
    const updated = await prisma.inquiry.update({
      where: { id: Number(id) },
      data: { status },
    });
    res.status(200).json({ message: `Status ကို ${status} သို့ ပြောင်းပြီးပါပြီ`, data: updated });
  } catch (error) {
    res.status(500).json({ message: "Status ပြောင်းလဲမှု မအောင်မြင်ပါ" });
  }
});

// ၄။ Inquiry ကို ဖျက်ထုတ်ရန် (Admin Only)
router.delete("/inquiries/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.inquiry.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ message: "Inquiry ကို ဖျက်ပြီးပါပြီ" });
  } catch (error) {
    res.status(500).json({ message: "ဖျက်ထုတ်၍ မရပါ" });
  }
});
