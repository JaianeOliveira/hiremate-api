-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('SENT', 'INTERVIEWS_AND_TESTS', 'SUBMISSION_PENDING', 'CULTURAL_FIT', 'OFFER_RECEIVED', 'REJECTED', 'NO_RESPONSE', 'OFFER_DECLINED', 'POSITION_ACCEPTED');

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'SENT',
    "applicationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "link" TEXT,
    "contact" TEXT,
    "feedback" TEXT,
    "isTalentPool" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Application_userId_idx" ON "Application"("userId");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
