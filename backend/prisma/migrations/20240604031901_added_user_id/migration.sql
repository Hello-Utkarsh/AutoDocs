/*
  Warnings:

  - The values [Markdown,text] on the enum `Type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `type` on the `docs` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the `format` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `table_id` to the `docs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `table_id` to the `notes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `tables` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Type_new" AS ENUM ('docs', 'notes');
ALTER TABLE "tables" ALTER COLUMN "content" TYPE "Type_new" USING ("content"::text::"Type_new");
ALTER TYPE "Type" RENAME TO "Type_old";
ALTER TYPE "Type_new" RENAME TO "Type";
DROP TYPE "Type_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "docs" DROP CONSTRAINT "docs_id_fkey";

-- DropForeignKey
ALTER TABLE "notes" DROP CONSTRAINT "notes_id_fkey";

-- DropForeignKey
ALTER TABLE "tables" DROP CONSTRAINT "tables_id_fkey";

-- AlterTable
ALTER TABLE "docs" DROP COLUMN "type",
ADD COLUMN     "table_id" INTEGER NOT NULL,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "formate_text" DROP NOT NULL;

-- AlterTable
ALTER TABLE "notes" DROP COLUMN "type",
ADD COLUMN     "table_id" INTEGER NOT NULL,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "formate_text" DROP NOT NULL;

-- AlterTable
ALTER TABLE "tables" ADD COLUMN     "user_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "format";

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "tables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "docs" ADD CONSTRAINT "docs_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "tables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
