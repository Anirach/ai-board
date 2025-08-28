-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_personas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "expertise" TEXT NOT NULL,
    "mindset" TEXT NOT NULL,
    "personality" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "avatar" TEXT,
    "isPreset" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT,
    CONSTRAINT "personas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_personas" ("avatar", "createdAt", "description", "expertise", "id", "isPreset", "mindset", "name", "personality", "role", "updatedAt") SELECT "avatar", "createdAt", "description", "expertise", "id", "isPreset", "mindset", "name", "personality", "role", "updatedAt" FROM "personas";
DROP TABLE "personas";
ALTER TABLE "new_personas" RENAME TO "personas";
CREATE UNIQUE INDEX "personas_name_key" ON "personas"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
