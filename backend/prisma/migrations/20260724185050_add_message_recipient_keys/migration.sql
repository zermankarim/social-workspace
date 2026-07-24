-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "ciphertext" DROP NOT NULL,
ALTER COLUMN "nonce" DROP NOT NULL;

-- CreateTable
CREATE TABLE "MessageRecipientKey" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "ciphertext" TEXT NOT NULL,
    "nonce" TEXT NOT NULL,
    "keyVersion" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageRecipientKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MessageRecipientKey_deviceId_idx" ON "MessageRecipientKey"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "MessageRecipientKey_messageId_deviceId_key" ON "MessageRecipientKey"("messageId", "deviceId");

-- AddForeignKey
ALTER TABLE "MessageRecipientKey" ADD CONSTRAINT "MessageRecipientKey_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageRecipientKey" ADD CONSTRAINT "MessageRecipientKey_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "UserDevice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
