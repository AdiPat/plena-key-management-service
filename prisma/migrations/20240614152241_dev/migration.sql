-- CreateTable
CREATE TABLE "RateLimits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accessKeyId" TEXT NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "limit" INTEGER NOT NULL,
    CONSTRAINT "RateLimits_accessKeyId_fkey" FOREIGN KEY ("accessKeyId") REFERENCES "AccessKey" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
