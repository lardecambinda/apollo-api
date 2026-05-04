-- DropForeignKey
ALTER TABLE "file" DROP CONSTRAINT "file_post_id_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_post_id_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_user_id_fkey";

-- DropTable
DROP TABLE "users";

-- DropTable
DROP TABLE "file";

-- DropTable
DROP TABLE "posts";

-- DropTable
DROP TABLE "comments";

-- DropEnum
DROP TYPE "Role";

