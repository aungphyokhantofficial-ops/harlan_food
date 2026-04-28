import express from "express";
const app = express();

app.use(express.json());
app.use(express.urlencoded());

import { router as hoursRouter } from "./routes/hours";
import { router as categoryRouter } from "./routes/category";
import { router as loginRouter } from "./routes/login";
import { router as venueRouter } from "./routes/venues";
import { router as inquiryRouter } from "./routes/inquiries";
import { router as galleryRouter } from "./routes/gallery";

app.use(galleryRouter);
app.use(inquiryRouter);
app.use(venueRouter);
app.use(loginRouter);
app.use(categoryRouter);
app.use(hoursRouter);

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000...");
});
