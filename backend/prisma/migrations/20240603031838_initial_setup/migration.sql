-- CreateEnum
CREATE TYPE "Type" AS ENUM ('Markdown', 'text');

-- CreateTable
CREATE TABLE "notes" (
    "id" SERIAL NOT NULL,
    "content" VARCHAR(280) NOT NULL,
    "type" "Type" NOT NULL,
    "user_id" INTEGER NOT NULL,
    "publish" BOOLEAN NOT NULL,
    "formate_text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "docs" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "type" "Type" NOT NULL,
    "user_id" INTEGER NOT NULL,
    "publish" BOOLEAN NOT NULL,
    "formate_text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "docs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tables" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "content" "Type" NOT NULL,
    "formate_text" TEXT NOT NULL,

    CONSTRAINT "tables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "format" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "format_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_id_fkey" FOREIGN KEY ("id") REFERENCES "format"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "docs" ADD CONSTRAINT "docs_id_fkey" FOREIGN KEY ("id") REFERENCES "format"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tables" ADD CONSTRAINT "tables_id_fkey" FOREIGN KEY ("id") REFERENCES "format"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
