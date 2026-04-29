import { prisma } from "../libs/prisma";
import express from "express";
import nodemailer from "nodemailer";
import { auth } from "../middleware/auth";
import multer from "multer"; // ၁။ multer ကို ပေါင်းထည့်ပါ

export const router = express.Router();

// multer setup (Memory ထဲမှာ ခေတ္တသိမ်းဆည်းရန်)
const upload = multer({ storage: multer.memoryStorage() });

// --- ၁။ Nodemailer Transporter Setup ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "aungphyokhant.official@gmail.com",
    pass: "noyd epri eofn pizx",
  },
});

// --- ၂။ User: ဘွတ်ကင်တင်သည့် Route (POST) ---
// upload.single("paymentScreenshot") ကို ဒီနေရာမှာ ထည့်ရပါမယ်
router.post("/reservations", upload.single("paymentScreenshot"), async (req, res) => {
  try {
    const { bookingDate, bookingTime, guestsCount, guestName, phoneNumber, email, selectedMenu, specialNotes, agreedToTerms } = req.body;

    // (က) Validation
    if (!bookingDate || !bookingTime || !guestsCount || !guestName || !phoneNumber || !email) {
      return res.status(400).json({ message: "လိုအပ်သောအချက်အလက်များ ပြည့်စုံစွာ ဖြည့်ပေးပါ။" });
    }

    // (ခ) Sunday Check
    const date = new Date(bookingDate);
    if (date.getDay() === 0) {
      return res.status(400).json({ message: "Sunday (တနင်္ဂနွေနေ့) သည် ဆိုင်ပိတ်ရက်ဖြစ်ပါသည်။" });
    }

    // (ဂ) Time Check
    const [hours] = bookingTime.split(":").map(Number);
    if (hours < 5 || hours >= 22) {
      return res.status(400).json({ message: "ဘွတ်ကင်အချိန်မှာ မနက် ၅ နာရီမှ ည ၁၀ နာရီအတွင်းသာ ဖြစ်ရပါမည်။" });
    }

    const guests = Number(guestsCount);
    const requireDeposit = guests >= 6;

    // (ဃ) ၆ ယောက်နှင့်အထက်ဖြစ်ပြီး ပုံမပါရင် တားမြစ်ခြင်း
    if (requireDeposit && !req.file) {
      return res.status(400).json({ message: "လူဦးရေ ၆ ယောက်နှင့်အထက် ဖြစ်သောကြောင့် ငွေလွှဲမှတ်တမ်း (Screenshot) တင်ပေးရန် လိုအပ်ပါသည်။" });
    }

    // (င) Database ထဲ သိမ်းဆည်းခြင်း
    const newReservation = await prisma.reservation.create({
      data: {
        bookingDate,
        bookingTime,
        guestsCount: guests,
        guestName,
        phoneNumber,
        email,
        selectedMenu,
        specialNotes,
        agreedToTerms: agreedToTerms === "true" || agreedToTerms === true,
        status: requireDeposit ? "awaiting_deposit" : "confirmed",
      },
    });

    // (စ) User ဆီသို့ Email ပို့ခြင်း
    const mailOptions = {
      from: '"Harlan Restaurant" <aungphyokhant.official@gmail.com>',
      to: email,
      subject: "Harlan Restaurant - Reservation Confirmed",
      html: `
        <div style="background-color: #1a1a1a; padding: 40px; color: #ffffff; font-family: sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #333333; padding: 30px; border-radius: 8px;">
            <h2 style="color: #d4af37;">Reservation Received</h2>
            <p>Mingalaba <strong>${guestName}</strong>,</p>
            <p>ဘွတ်ကင်တင်ခြင်း အောင်မြင်ပါသည်။ ဆိုင်သို့ ရောက်ရှိလာမည့် အချိန်ကို စောင့်မျှော်နေပါမည်။</p>
            <hr />
            <p>📅 Date: ${bookingDate}</p>
            <p>⏰ Time: ${bookingTime}</p>
            <p>👥 Guests: ${guestsCount}</p>
          </div>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (mailError) {
      console.error("❌ Email failed:", mailError);
    }

    return res.status(201).json({
      success: true,
      data: newReservation,
      paymentRequired: requireDeposit,
      paymentDetails:
        requireDeposit ?
          {
            message: "လူဦးရေ ၆ ယောက်နှင့်အထက် ဖြစ်သောကြောင့် ၂၀% Deposit ပေးဆောင်ရပါမည်။",
            kpay: "09123456789 (Aung Phyo Khant)",
            amount: "20,000 MMK",
          }
        : null,
    });
  } catch (error) {
    console.error("❌ Server Error:", error);
    return res.status(500).json({ message: "Server Error: ဘွတ်ကင်တင်ရာတွင် အခက်အဲရှိနေပါသည်။" });
  }
});

// --- ၃။ Admin: ဘွတ်ကင်စာရင်းများ ကြည့်ရန် ---
router.get("/reservations", auth, async (req, res) => {
  try {
    const list = await prisma.reservation.findMany({ orderBy: { createdAt: "desc" } });
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching data" });
  }
});

// --- ၄။ Admin: ဘွတ်ကင်ဖျက်ရန် ---
router.delete("/reservations/:id", auth, async (req, res) => {
  try {
    await prisma.reservation.delete({ where: { id: Number(req.params.id) } });
    return res.json({ message: "Deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Error deleting" });
  }
});
