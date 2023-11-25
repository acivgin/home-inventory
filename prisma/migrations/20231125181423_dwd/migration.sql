/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `nick` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "imageUrl";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "nick";
