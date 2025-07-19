/*
  Warnings:

  - The values [NOTE_CHANGE] on the enum `ApplicationEventType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ApplicationEventType_new" AS ENUM ('CREATION', 'STATUS_CHANGE', 'NOTE_CREATION');
ALTER TABLE "ApplicationEvent" ALTER COLUMN "type" TYPE "ApplicationEventType_new" USING ("type"::text::"ApplicationEventType_new");
ALTER TYPE "ApplicationEventType" RENAME TO "ApplicationEventType_old";
ALTER TYPE "ApplicationEventType_new" RENAME TO "ApplicationEventType";
DROP TYPE "ApplicationEventType_old";
COMMIT;
