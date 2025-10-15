-- CreateTable
CREATE TABLE "ClubImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clubId" TEXT NOT NULL,

    CONSTRAINT "ClubImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourtImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "courtId" TEXT NOT NULL,

    CONSTRAINT "CourtImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClubImage_clubId_idx" ON "ClubImage"("clubId");

-- CreateIndex
CREATE INDEX "ClubImage_clubId_isPrimary_idx" ON "ClubImage"("clubId", "isPrimary");

-- CreateIndex
CREATE INDEX "CourtImage_courtId_idx" ON "CourtImage"("courtId");

-- CreateIndex
CREATE INDEX "CourtImage_courtId_isPrimary_idx" ON "CourtImage"("courtId", "isPrimary");

-- AddForeignKey
ALTER TABLE "ClubImage" ADD CONSTRAINT "ClubImage_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourtImage" ADD CONSTRAINT "CourtImage_courtId_fkey" FOREIGN KEY ("courtId") REFERENCES "Court"("id") ON DELETE CASCADE ON UPDATE CASCADE;
