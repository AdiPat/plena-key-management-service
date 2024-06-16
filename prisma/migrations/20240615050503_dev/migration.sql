/*
  Warnings:

  - Added the required column `expiry` to the `AccessKey` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AccessKey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "expiry" DATETIME NOT NULL,
    "key" TEXT NOT NULL,
    CONSTRAINT "AccessKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AccessKey" ("createdAt", "id", "key", "updatedAt", "userId") SELECT "createdAt", "id", "key", "updatedAt", "userId" FROM "AccessKey";
DROP TABLE "AccessKey";
ALTER TABLE "new_AccessKey" RENAME TO "AccessKey";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
