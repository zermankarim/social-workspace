-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'PROFILE_VIEW';

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "impressionsCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "ProfileView" (
    "id" TEXT NOT NULL,
    "viewerId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfileView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsStory" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "url" TEXT,
    "readersCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsStory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageReaction" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessageReaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProfileView_profileId_updatedAt_idx" ON "ProfileView"("profileId", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileView_viewerId_profileId_key" ON "ProfileView"("viewerId", "profileId");

-- CreateIndex
CREATE INDEX "NewsStory_createdAt_idx" ON "NewsStory"("createdAt");

-- CreateIndex
CREATE INDEX "MessageReaction_messageId_idx" ON "MessageReaction"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "MessageReaction_messageId_userId_key" ON "MessageReaction"("messageId", "userId");

-- AddForeignKey
ALTER TABLE "ProfileView" ADD CONSTRAINT "ProfileView_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileView" ADD CONSTRAINT "ProfileView_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "PostImpression" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "viewerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostImpression_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsStoryRead" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsStoryRead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PostImpression_postId_idx" ON "PostImpression"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "PostImpression_viewerId_postId_key" ON "PostImpression"("viewerId", "postId");

-- CreateIndex
CREATE INDEX "NewsStoryRead_storyId_idx" ON "NewsStoryRead"("storyId");

-- CreateIndex
CREATE UNIQUE INDEX "NewsStoryRead_userId_storyId_key" ON "NewsStoryRead"("userId", "storyId");

-- AddForeignKey
ALTER TABLE "MessageReaction" ADD CONSTRAINT "MessageReaction_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageReaction" ADD CONSTRAINT "MessageReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostImpression" ADD CONSTRAINT "PostImpression_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostImpression" ADD CONSTRAINT "PostImpression_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsStoryRead" ADD CONSTRAINT "NewsStoryRead_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "NewsStory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsStoryRead" ADD CONSTRAINT "NewsStoryRead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
