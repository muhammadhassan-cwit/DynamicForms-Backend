-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_super_admin" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "company_ref_id" DROP NOT NULL;
