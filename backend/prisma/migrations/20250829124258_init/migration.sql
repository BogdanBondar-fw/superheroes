-- CreateTable
CREATE TABLE "public"."Superhero" (
    "id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "real_name" TEXT,
    "origin_description" TEXT,
    "superpowers" TEXT,
    "catch_phrase" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Superhero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "hero_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Superhero_nickname_idx" ON "public"."Superhero"("nickname");

-- CreateIndex
CREATE INDEX "Image_hero_id_idx" ON "public"."Image"("hero_id");

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_hero_id_fkey" FOREIGN KEY ("hero_id") REFERENCES "public"."Superhero"("id") ON DELETE CASCADE ON UPDATE CASCADE;
