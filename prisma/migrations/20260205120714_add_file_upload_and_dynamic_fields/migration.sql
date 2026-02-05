-- CreateTable
CREATE TABLE "form_fields" (
    "id" BIGSERIAL NOT NULL,
    "formId" BIGINT NOT NULL,
    "label" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "options" JSONB,
    "maxSize" INTEGER,
    "allowedTypes" TEXT,
    "placeholder" TEXT,
    "fileUrl" TEXT,

    CONSTRAINT "form_fields_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "form_fields" ADD CONSTRAINT "form_fields_formId_fkey" FOREIGN KEY ("formId") REFERENCES "forms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
