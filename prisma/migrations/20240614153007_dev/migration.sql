/*
  Warnings:

  - You are about to drop the column `limit` on the `RateLimits` table. All the data in the column will be lost.
  - Added the required column `limitPerSecond` to the `RateLimits` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RateLimits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accessKeyId" TEXT NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "limitPerSecond" INTEGER NOT NULL,
    CONSTRAINT "RateLimits_accessKeyId_fkey" FOREIGN KEY ("accessKeyId") REFERENCES "AccessKey" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RateLimits" ("accessKeyId", "createdAt", "id", "updatedAt") SELECT "accessKeyId", "createdAt", "id", "updatedAt" FROM "RateLimits";
DROP TABLE "RateLimits";
ALTER TABLE "new_RateLimits" RENAME TO "RateLimits";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
