-- Migración para agregar tablas de imágenes
-- Ejecutar este script en Supabase SQL Editor

-- Crear tabla de imágenes de clubes
CREATE TABLE IF NOT EXISTS "ClubImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clubId" TEXT NOT NULL
);

-- Crear tabla de imágenes de canchas
CREATE TABLE IF NOT EXISTS "CourtImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "courtId" TEXT NOT NULL
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS "ClubImage_clubId_idx" ON "ClubImage"("clubId");
CREATE INDEX IF NOT EXISTS "ClubImage_clubId_isPrimary_idx" ON "ClubImage"("clubId", "isPrimary");
CREATE INDEX IF NOT EXISTS "CourtImage_courtId_idx" ON "CourtImage"("courtId");
CREATE INDEX IF NOT EXISTS "CourtImage_courtId_isPrimary_idx" ON "CourtImage"("courtId", "isPrimary");

-- Agregar foreign keys
ALTER TABLE "ClubImage" ADD CONSTRAINT "ClubImage_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CourtImage" ADD CONSTRAINT "CourtImage_courtId_fkey" FOREIGN KEY ("courtId") REFERENCES "Court"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Habilitar RLS (Row Level Security) si es necesario
ALTER TABLE "ClubImage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CourtImage" ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para ClubImage
CREATE POLICY "ClubImage_select_policy" ON "ClubImage" FOR SELECT USING (true);
CREATE POLICY "ClubImage_insert_policy" ON "ClubImage" FOR INSERT WITH CHECK (true);
CREATE POLICY "ClubImage_update_policy" ON "ClubImage" FOR UPDATE USING (true);
CREATE POLICY "ClubImage_delete_policy" ON "ClubImage" FOR DELETE USING (true);

-- Políticas de seguridad para CourtImage
CREATE POLICY "CourtImage_select_policy" ON "CourtImage" FOR SELECT USING (true);
CREATE POLICY "CourtImage_insert_policy" ON "CourtImage" FOR INSERT WITH CHECK (true);
CREATE POLICY "CourtImage_update_policy" ON "CourtImage" FOR UPDATE USING (true);
CREATE POLICY "CourtImage_delete_policy" ON "CourtImage" FOR DELETE USING (true);
