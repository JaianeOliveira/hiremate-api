-- CreateTable
CREATE TABLE "User" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Account" (
    "uuid" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "user_uuid" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_account_id_key" ON "Account"("provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "Account_user_uuid_key" ON "Account"("user_uuid");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
