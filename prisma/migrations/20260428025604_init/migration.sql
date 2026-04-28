-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'FOOD'
);

-- CreateTable
CREATE TABLE "FoodItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL,
    "image" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "categoryId" INTEGER NOT NULL,
    CONSTRAINT "FoodItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Venue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "capacity" INTEGER NOT NULL,
    "image" TEXT
);

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "eventDate" DATETIME NOT NULL,
    "guestCount" INTEGER NOT NULL,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "venueId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Inquiry_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Job" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Gallery" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "imageUrl" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "caption" TEXT
);

-- CreateTable
CREATE TABLE "OpeningHour" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dayOfWeek" TEXT NOT NULL,
    "shiftName" TEXT,
    "openTime" TEXT NOT NULL,
    "closeTime" TEXT NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Venue_slug_key" ON "Venue"("slug");
