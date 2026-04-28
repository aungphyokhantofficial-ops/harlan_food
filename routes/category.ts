import express from "express";
export const router = express.Router();

import { prisma } from "../libs/prisma";

router.get("/category", async (req, res) => {
  const categories = await prisma.category.findMany({
    where: {
      type: "FOOD",
    },
    include: {
      foodItems: true,
    },
  });

  res.json(categories);
});

router.get("/category/:id", async (req, res) => {
  const id = req.params.id;
  const category = await prisma.category.findFirst({
    where: {
      id: Number(id),
    },
    include: {
      foodItems: true,
    },
  });

  res.json(category);
});
