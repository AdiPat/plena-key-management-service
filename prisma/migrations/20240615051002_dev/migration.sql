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
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "AccessKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AccessKey" ("createdAt", "expiry", "id", "key", "updatedAt", "userId") SELECT "createdAt", "expiry", "id", "key", "updatedAt", "userId" FROM "AccessKey";
DROP TABLE "AccessKey";
ALTER TABLE "new_AccessKey" RENAME TO "AccessKey";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
