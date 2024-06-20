-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);

-- CreateTable
CREATE TABLE "AccessKey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "expiry" DATETIME NOT NULL,
    "key" TEXT NOT NULL,
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "AccessKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RateLimits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accessKeyId" TEXT NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "limit" INTEGER NOT NULL,
    "interval" INTEGER NOT NULL DEFAULT 60,
    CONSTRAINT "RateLimits_accessKeyId_fkey" FOREIGN KEY ("accessKeyId") REFERENCES "AccessKey" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
