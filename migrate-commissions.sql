-- Migración para agregar campos de comisiones a las tablas existentes

-- 1. Agregar campos de comisión a la tabla Reservation
ALTER TABLE "Reservation" 
ADD COLUMN "platformFeeCents" INTEGER DEFAULT 0,
ADD COLUMN "clubFeeCents" INTEGER DEFAULT 0,
ADD COLUMN "commissionId" TEXT;

-- 2. Agregar campos de comisión a la tabla Payment
ALTER TABLE "Payment" 
ADD COLUMN "platformFeeCents" INTEGER DEFAULT 0,
ADD COLUMN "clubFeeCents" INTEGER DEFAULT 0;

-- 3. Crear tabla Commission
CREATE TABLE "Commission" (
    "id" TEXT NOT NULL,
    "platformFeeBps" INTEGER NOT NULL DEFAULT 1000,
    "clubFeeBps" INTEGER NOT NULL DEFAULT 9000,
    "effectiveFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "clubId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Commission_pkey" PRIMARY KEY ("id")
);

-- 4. Crear índices para optimizar consultas
CREATE INDEX "Commission_clubId_idx" ON "Commission"("clubId");
CREATE INDEX "Commission_isActive_idx" ON "Commission"("isActive");
CREATE INDEX "Commission_effectiveFrom_idx" ON "Commission"("effectiveFrom");

-- 5. Agregar foreign key constraint para commissionId en Reservation
ALTER TABLE "Reservation" 
ADD CONSTRAINT "Reservation_commissionId_fkey" 
FOREIGN KEY ("commissionId") REFERENCES "Commission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- 6. Agregar foreign key constraint para clubId en Commission
ALTER TABLE "Commission" 
ADD CONSTRAINT "Commission_clubId_fkey" 
FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- 7. Insertar comisión por defecto (10% plataforma, 90% club)
INSERT INTO "Commission" ("id", "platformFeeBps", "clubFeeBps", "isActive", "effectiveFrom")
VALUES (
    gen_random_uuid(),
    1000,  -- 10%
    9000,  -- 90%
    true,
    CURRENT_TIMESTAMP
);

-- 8. Actualizar reservas existentes con comisiones por defecto
UPDATE "Reservation" 
SET 
    "platformFeeCents" = ROUND("totalCents" * 0.10),
    "clubFeeCents" = ROUND("totalCents" * 0.90),
    "commissionId" = (SELECT "id" FROM "Commission" WHERE "isActive" = true LIMIT 1)
WHERE "platformFeeCents" = 0 AND "clubFeeCents" = 0;

-- 9. Actualizar pagos existentes con comisiones por defecto
UPDATE "Payment" 
SET 
    "platformFeeCents" = ROUND("amountCents" * 0.10),
    "clubFeeCents" = ROUND("amountCents" * 0.90)
WHERE "platformFeeCents" = 0 AND "clubFeeCents" = 0;
