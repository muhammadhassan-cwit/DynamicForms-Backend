CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "companies" (
    "id" BIGSERIAL NOT NULL,
    "company_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "company_name" VARCHAR(255) NOT NULL,
    "domain" VARCHAR(255) NOT NULL,
    "address" TEXT,
    "theme_config" JSONB DEFAULT '{}',
    "settings_metadata" JSONB DEFAULT '{}',
    "timezone" VARCHAR(100) DEFAULT 'UTC',
    "is_active" BOOLEAN DEFAULT true,
    "is_deleted" BOOLEAN DEFAULT false,
    "deleted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "user_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "company_ref_id" BIGINT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "user_full_name" VARCHAR(255),
    "user_role" VARCHAR(50) DEFAULT 'employee',
    "profile_data" JSONB DEFAULT '{}',
    "last_login_at" TIMESTAMPTZ(6),
    "auth_token" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "is_deleted" BOOLEAN DEFAULT false,
    "deleted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forms" (
    "id" BIGSERIAL NOT NULL,
    "form_id" UUID DEFAULT uuid_generate_v4(),
    "form_title" VARCHAR(255) NOT NULL,
    "form_description" TEXT,
    "structure_schema" JSONB NOT NULL,
    "media_assets" JSONB DEFAULT '[]',
    "form_config" JSONB DEFAULT '{}',
    "version_major" INTEGER DEFAULT 1,
    "version_minor" INTEGER DEFAULT 0,
    "parent_form_group_id" UUID,
    "is_current_version" BOOLEAN DEFAULT true,
    "is_published" BOOLEAN DEFAULT false,
    "is_deleted" BOOLEAN DEFAULT false,
    "deleted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_forms" (
    "id" BIGSERIAL NOT NULL,
    "company_ref_id" BIGINT NOT NULL,
    "form_ref_id" BIGINT NOT NULL,
    "is_form_enabled" BOOLEAN DEFAULT true,
    "custom_override_config" JSONB DEFAULT '{}',
    "assigned_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" BIGSERIAL NOT NULL,
    "contact_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "company_ref_id" BIGINT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "full_name" VARCHAR(255),
    "contact_data" JSONB DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_forms" (
    "id" BIGSERIAL NOT NULL,
    "submission_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "contact_ref_id" BIGINT NOT NULL,
    "form_ref_id" BIGINT NOT NULL,
    "company_ref_id" BIGINT NOT NULL,
    "response_data" JSONB NOT NULL,
    "submission_status" VARCHAR(50) DEFAULT 'submitted',
    "device_metadata" JSONB DEFAULT '{}',
    "submitted_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "is_deleted" BOOLEAN DEFAULT false,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "contact_forms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_company_id_key" ON "companies"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "companies_domain_key" ON "companies"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "users_user_id_key" ON "users"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_company_staff_email" ON "users"("company_ref_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "unique_company_form_link" ON "company_forms"("company_ref_id", "form_ref_id");

-- CreateIndex
CREATE UNIQUE INDEX "contacts_contact_id_key" ON "contacts"("contact_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_company_contact_email" ON "contacts"("company_ref_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "contact_forms_submission_id_key" ON "contact_forms"("submission_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_contact_submission_per_version" ON "contact_forms"("contact_ref_id", "form_ref_id", "company_ref_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_company_ref_id_fkey" FOREIGN KEY ("company_ref_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_forms" ADD CONSTRAINT "company_forms_company_ref_id_fkey" FOREIGN KEY ("company_ref_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_forms" ADD CONSTRAINT "company_forms_form_ref_id_fkey" FOREIGN KEY ("form_ref_id") REFERENCES "forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_company_ref_id_fkey" FOREIGN KEY ("company_ref_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_forms" ADD CONSTRAINT "contact_forms_contact_ref_id_fkey" FOREIGN KEY ("contact_ref_id") REFERENCES "contacts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_forms" ADD CONSTRAINT "contact_forms_form_ref_id_fkey" FOREIGN KEY ("form_ref_id") REFERENCES "forms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_forms" ADD CONSTRAINT "contact_forms_company_ref_id_fkey" FOREIGN KEY ("company_ref_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
