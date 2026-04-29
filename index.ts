import express from "express";
const app = express();
app.use(express.json());
app.use(express.urlencoded());

import cors from "cors";
app.use(cors());

import { router as LoginRouter } from "./routes/login";
import { router as HoursRouter } from "./routes/hours";
import { router as MenuRouter } from "./routes/menus";
import { router as AdminRouter } from "./routes/‌admins";
import { router as GalleryRouter } from "./routes/gallerys";
import { router as ContactRouter } from "./routes/contacts";
import { router as ReservationRouter } from "./routes/reservations";

app.use("/uploads", express.static("uploads"));

app.use(ReservationRouter);
app.use(ContactRouter);
app.use(GalleryRouter);
app.use(AdminRouter); // အသစ်ဖြည့်စွက်ချက်များကို ပြန်လည်ရန်
app.use(MenuRouter);
app.use(HoursRouter);
app.use(LoginRouter);

app.get("/", (req, res) => {
  res.json({ message: "Food-API up and running..." });
});

app.listen(8800, () => {
  console.log("Server is running on port 8800...");
});
