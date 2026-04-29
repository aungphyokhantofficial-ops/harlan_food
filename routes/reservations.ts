import { prisma } from "../libs/prisma";
import express from "express";
import nodemailer from "nodemailer";
import { auth } from "../middleware/auth";

export const router = express.Router();

// --- ၁။ Nodemailer Transporter Setup ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "aungphyokhant.official@gmail.com", // သင့် Email
    pass: "noyd epri eofn pizx", // Gmail ကထုတ်ထားတဲ့ ၁၆ လုံးပါ App Password
  },
});

// --- ၂။ User: ဘွတ်ကင်တင်သည့် Route (POST) ---
router.post("/reservations", async (req, res) => {
  try {
    const { bookingDate, bookingTime, guestsCount, guestName, phoneNumber, email, selectedMenu, specialNotes, agreedToTerms } = req.body;

    // (က) Validation: လိုအပ်ချက်များ စစ်ဆေးခြင်း
    if (!bookingDate || !bookingTime || !guestsCount || !guestName || !phoneNumber || !email) {
      return res.status(400).json({ message: "လိုအပ်သောအချက်အလက်များ ပြည့်စုံစွာ ဖြည့်ပေးပါ။" });
    }

    // (ခ) Sunday Check: တနင်္ဂနွေနေ့ ပိတ်ခြင်း
    const date = new Date(bookingDate);
    if (date.getDay() === 0) {
      return res.status(400).json({ message: "Sunday (တနင်္ဂနွေနေ့) သည် ဆိုင်ပိတ်ရက်ဖြစ်ပါသည်။" });
    }

    // (ဂ) Time Check: မနက် ၅ နာရီမှ ည ၁၀ နာရီအတွင်းသာ
    const [hours] = bookingTime.split(":").map(Number);
    if (hours < 5 || hours >= 22) {
      return res.status(400).json({ message: "ဘွတ်ကင်အချိန်မှာ မနက် ၅ နာရီမှ ည ၁၀ နာရီအတွင်းသာ ဖြစ်ရပါမည်။" });
    }

    // (ဃ) Deposit Logic: ၆ ယောက်နှင့် အထက် Deposit စစ်ခြင်း
    const guests = Number(guestsCount);
    const requireDeposit = guests >= 6;

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
        agreedToTerms: Boolean(agreedToTerms),
        status: requireDeposit ? "awaiting_deposit" : "confirmed",
      },
    });

    // (စ) User ဆီသို့ Email ပို့ခြင်း (await သုံးထားလို့ သေချာပေါက် ထွက်သွားပါမယ်)
    const mailOptions = {
      from: '"Harlan Restaurant" <aungphyokhant.official@gmail.com>',
      to: email,
      subject: "Harlan Restaurant - Reservation Confirmed",
      html: `
    <div style="background-color: #1a1a1a; padding: 40px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #ffffff;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #333333; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
        
        <div style="background-color: #d4af37; padding: 30px; text-align: center;">
          <h1 style="margin: 0; color: #ffffff; letter-spacing: 2px; text-transform: uppercase;">Harlan</h1>
          <p style="margin: 5px 0 0; color: #ffffff; font-style: italic;">Fine Dining Experience</p>
        </div>

        <div style="padding: 30px;">
          <h2 style="color: #d4af37; margin-top: 0;">Reservation Confirmed</h2>
          <p>Mingalaba <strong>${guestName}</strong>,</p>
          <p>သင့်ရဲ့ ဘွတ်ကင် တင်ခြင်း အောင်မြင်ပါသည်။ ဆိုင်သို့ ရောက်ရှိလာမည့် အချိန်ကို စောင့်မျှော်နေပါမည်။</p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0; border: 1px solid #eee;">
            <p style="margin: 5px 0;"><strong>📅 Date:</strong> ${bookingDate}</p>
            <p style="margin: 5px 0;"><strong>⏰ Time:</strong> ${bookingTime}</p>
            <p style="margin: 5px 0;"><strong>👥 Guests:</strong> ${guestsCount} ယောက်</p>
            <p style="margin: 5px 0;"><strong>📞 Phone:</strong> ${phoneNumber}</p>
          </div>

          <p style="font-size: 0.9em; color: #666;">*မှတ်ချက် - ဘွတ်ကင် အပြောင်းအလဲ ရှိပါက ဆိုင်သို့ ဖုန်းဆက်၍ အကြောင်းကြားပေးပါရန်။</p>
        </div>

        <div style="background-color: #f1f1f1; padding: 20px; text-align: center; font-size: 0.8em; color: #888;">
          <p>Harlan Restaurant, Yangon, Myanmar</p>
          <p>© 2026 Harlan Restaurant. All rights reserved.</p>
        </div>
      </div>
    </div>
  `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Email sent to: ${email}`);
    } catch (mailError) {
      console.error("❌ Email failed:", mailError);
      // Email မရောက်ရင်တောင် DB မှာ data သိမ်းပြီးသားမို့ response ပြန်ပေးပါမယ်
    }

    // (ဆ) Response ပြန်ခြင်း
    return res.status(201).json({
      success: true,
      data: newReservation,
      paymentRequired: requireDeposit,
      paymentDetails:
        requireDeposit ?
          {
            message: "လူဦးရေ ၆ ယောက်နှင့်အထက် ဖြစ်သောကြောင့် ၂၀% Deposit ပေးဆောင်ရပါမည်။",
            kpay: "09123456789 (Aung Phyo Khant)",
            amount: "20% of Total Bill",
          }
        : null,
    });
  } catch (error) {
    console.error("❌ Server Error:", error);
    return res.status(500).json({ message: "Server Error: ဘွတ်ကင်တင်ရာတွင် အခက်အခဲရှိနေပါသည်။" });
  }
});

// --- ၃။ Admin: ဘွတ်ကင်စာရင်းများ ကြည့်ရန် (GET) ---
router.get("/reservations", auth, async (req, res) => {
  try {
    const list = await prisma.reservation.findMany({ orderBy: { createdAt: "desc" } });
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching data" });
  }
});

// --- ၄။ Admin: ဘွတ်ကင်ဖျက်ရန် (DELETE) ---
router.delete("/reservations/:id", auth, async (req, res) => {
  try {
    await prisma.reservation.delete({ where: { id: Number(req.params.id) } });
    return res.json({ message: "Deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Error deleting" });
  }
});
