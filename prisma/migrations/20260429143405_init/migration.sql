/*
  Warnings:

  - You are about to drop the `menu_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `menu_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reservations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "menu_categories";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "menu_items";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "reservations";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "MenuCategory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "menuType" TEXT NOT NULL,
    "image" TEXT
);

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "image" TEXT,
    "menuCategoryId" INTEGER NOT NULL,
    CONSTRAINT "MenuItem_menuCategoryId_fkey" FOREIGN KEY ("menuCategoryId") REFERENCES "MenuCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bookingDate" TEXT NOT NULL,
    "bookingTime" TEXT NOT NULL,
    "guestsCount" INTEGER NOT NULL,
    "selectedMenu" TEXT NOT NULL,
    "guestName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "otherContactId" TEXT,
    "specialNotes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "agreedToTerms" BOOLEAN NOT NULL DEFAULT false,
    "understoodLeadTime" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
