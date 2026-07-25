-- AlterTable
ALTER TABLE "JobApplication" ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactPhone" TEXT;

-- CreateTable
CREATE TABLE "CompanyFollower" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompanyFollower_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CompanyFollower_companyId_idx" ON "CompanyFollower"("companyId");

-- CreateIndex
CREATE INDEX "CompanyFollower_userId_idx" ON "CompanyFollower"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyFollower_companyId_userId_key" ON "CompanyFollower"("companyId", "userId");

-- AddForeignKey
ALTER TABLE "CompanyFollower" ADD CONSTRAINT "CompanyFollower_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyFollower" ADD CONSTRAINT "CompanyFollower_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
