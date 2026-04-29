import express from "express";
import { prisma } from "../libs/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    // Debug: req.body ရောက်မရောက် စစ်ဆေးရန်
    console.log("Input Data:", req.body);

    const { email, password } = req.body;

    // ၁။ Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email နှင့် Password ထည့်ပါ" });
    }

    // ၂။ User ရှာဖွေခြင်း
    const user = await prisma.adminUser.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(401).json({ message: "Email သို့မဟုတ် Password မှားယွင်းနေပါသည်" });
    }

    // ၃။ Password တိုက်စစ်ခြင်း
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email သို့မဟုတ် Password မှားယွင်းနေပါသည်" });
    }

    // ၄။ Token ထုတ်ခြင်း
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: "24h" });

    // ၅။ Response ပြန်ခြင်း
    return res.status(200).json({
      message: "Login Successful",
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error: any) {
    // Error အတိအကျကို terminal မှာ ကြည့်ပါ
    console.error("Database or Code Error:", error);
    return res.status(500).json({ message: "Internal Server Error", detail: error.message });
  }
});
