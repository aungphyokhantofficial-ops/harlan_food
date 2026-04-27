import express from "express";
import cors from "cors";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000...");
});
