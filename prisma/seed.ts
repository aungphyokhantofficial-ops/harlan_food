import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

async function seed() {
  const alice = await prisma.user.create({
    data: {
      email: "alice@gmail.com",
      password: await bcrypt.hash("123456", 10),
      role: "ADMIN",
    },
  });

  console.log(alice);
}

seed();
