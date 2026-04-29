/*
  Warnings:

  - You are about to drop the column `address` on the `site_settings` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `site_settings` table. All the data in the column will be lost.
  - Added the required column `message` to the `site_settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `site_settings` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_site_settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "googleMapUrl" TEXT NOT NULL
);
INSERT INTO "new_site_settings" ("email", "googleMapUrl", "id") SELECT "email", "googleMapUrl", "id" FROM "site_settings";
DROP TABLE "site_settings";
ALTER TABLE "new_site_settings" RENAME TO "site_settings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
