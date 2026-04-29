import { prisma } from "../libs/prisma";
import express from "express";
import { auth } from "../middleware/auth";

export const router = express.Router();

// --- Public Route ---

// ၁။ User က Message ပို့ရန် (Contact Form အတွက်)
// POST /api/contacts
router.post("/contacts", async (req, res) => {
  try {
    const { userName, userEmail, subject, message } = req.body;

    if (!userName || !userEmail || !message) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const newMessage = await prisma.contactMessage.create({
      data: {
        userName,
        userEmail,
        subject: subject || "No Subject",
        message,
        isRead: false, // Default အနေနဲ့ မဖတ်ရသေးဘူးလို့ သတ်မှတ်မယ်
      },
    });
    return res.status(201).json(newMessage);
  } catch (error) {
    return res.status(500).json({ message: "Error sending message" });
  }
});

// --- Admin Routes (Auth လိုအပ်သည်) ---

// ၂။ Admin မှ Message အားလုံးကို ကြည့်ရန်
// GET /api/contacts
router.get("/contacts", auth, async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching messages" });
  }
});

// ၃။ Admin မှ Message တစ်ခုကို "ဖတ်ပြီးသား" အဖြစ် Mark လုပ်ရန် (Update isRead)
// PATCH /api/contacts/:id/read
router.patch("/contacts/:id/read", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMsg = await prisma.contactMessage.update({
      where: { id: Number(id) },
      data: { isRead: true },
    });
    return res.json(updatedMsg);
  } catch (error) {
    return res.status(500).json({ message: "Error updating message status" });
  }
});

// ၄။ Admin မှ Message ကို ဖျက်ရန်
// DELETE /api/contacts/:id
router.delete("/contacts/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.contactMessage.delete({
      where: { id: Number(id) },
    });
    return res.json({ message: "Message deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting message" });
  }
});
