-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "image" TEXT
);

-- CreateTable
CREATE TABLE "FoodItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL NOT NULL,
    "image" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "categoryId" INTEGER NOT NULL,
    CONSTRAINT "FoodItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "totalPrice" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quantity" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "foodItemId" INTEGER NOT NULL,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_foodItemId_fkey" FOREIGN KEY ("foodItemId") REFERENCES "FoodItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reservationDate" DATETIME NOT NULL,
    "numberOfGuests" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "userId" INTEGER NOT NULL,
    "specialRequest" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
