/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FoodItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Gallery` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Inquiry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Job` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Venue` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Category";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "FoodItem";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Gallery";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Inquiry";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Job";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Venue";
PRAGMA foreign_keys=on;
