-- AlterTable
ALTER TABLE "Commission" ADD COLUMN     "clubFeeBps" INTEGER NOT NULL DEFAULT 9000,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "clubFeeCents" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "platformFeeCents" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "clubFeeCents" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "commissionId" TEXT,
ADD COLUMN     "platformFeeCents" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_commissionId_fkey" FOREIGN KEY ("commissionId") REFERENCES "Commission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
