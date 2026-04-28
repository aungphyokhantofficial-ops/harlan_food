import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../libs/prisma";

export const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ၁။ User ရှိမရှိ စစ်ဆေးခြင်း
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    // ၂။ User ရှိမရှိ နှင့် Password မှန်မမှန် စစ်ဆေးခြင်း
    if (user && (await bcrypt.compare(password, user.password))) {
      // ၃။ JWT Token ထုတ်ပေးခြင်း (role ကိုပါ ထည့်ပေးထားပါသည်)
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string);

      // ၄။ Password ကို response ထဲမှာ မပါစေရန် ဖယ်ထုတ်ခြင်း
      const { password: _, ...userWithoutPassword } = user;

      return res.status(200).json({
        message: "Login Successful",
        token, // Token ကို client ဆီ ပို့ပေးရမည်
        user: userWithoutPassword,
      });
    } else {
      // ၅။ အချက်အလက် မကိုက်ညီလျှင် ၅၀၀ (သို့မဟုတ် ပိုမှန်ကန်သော ၄၀၁) ပြန်ပေးခြင်း
      return res.status(500).json({ message: "Email သို့မဟုတ် Password မှားယွင်းနေပါသည်" });
    }
  } catch (error) {
    console.error(error); // Error ကို log ထုတ်ထားရန်
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
