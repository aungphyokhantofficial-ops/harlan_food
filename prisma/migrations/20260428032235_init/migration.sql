/*
  Warnings:

  - You are about to drop the `OpeningHour` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "OpeningHour";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Hours" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dayOfWeek" TEXT NOT NULL,
    "shiftName" TEXT,
    "openTime" TEXT NOT NULL,
    "closeTime" TEXT NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL
);
