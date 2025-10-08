/*
  Warnings:

  - The values [WEDNESSDAY] on the enum `Day` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Day_new" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY');
ALTER TABLE "public"."Lesson" ALTER COLUMN "day" TYPE "public"."Day_new" USING ("day"::text::"public"."Day_new");
ALTER TYPE "public"."Day" RENAME TO "Day_old";
ALTER TYPE "public"."Day_new" RENAME TO "Day";
DROP TYPE "public"."Day_old";
COMMIT;
