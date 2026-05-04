/*
  Warnings:

  - You are about to drop the column `posts_id` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `users_id` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `users_id` on the `posts` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_posts_id_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_users_id_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_users_id_fkey";

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "posts_id",
DROP COLUMN "users_id",
ADD COLUMN     "post_id" TEXT,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "users_id",
ADD COLUMN     "user_id" TEXT;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
