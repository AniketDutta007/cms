-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('VEG', 'NON_VEG');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('BREAKFAST', 'LUNCH', 'SNACKS');

-- CreateTable
CREATE TABLE "Menu" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "serviceType" "ServiceType" NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItems" (
    "menuId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,

    CONSTRAINT "MenuItems_pkey" PRIMARY KEY ("menuId","itemId")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "ItemType" NOT NULL,
    "image" TEXT,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Combo" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "serviceType" "ServiceType" NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Combo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComboItems" (
    "comboId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,

    CONSTRAINT "ComboItems_pkey" PRIMARY KEY ("comboId","itemId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Menu_date_serviceType_key" ON "Menu"("date", "serviceType");

-- CreateIndex
CREATE UNIQUE INDEX "Item_name_key" ON "Item"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Combo_date_serviceType_key" ON "Combo"("date", "serviceType");

-- AddForeignKey
ALTER TABLE "MenuItems" ADD CONSTRAINT "MenuItems_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItems" ADD CONSTRAINT "MenuItems_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComboItems" ADD CONSTRAINT "ComboItems_comboId_fkey" FOREIGN KEY ("comboId") REFERENCES "Combo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComboItems" ADD CONSTRAINT "ComboItems_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
