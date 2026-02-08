-- CreateTable
CREATE TABLE "Table" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" TEXT NOT NULL,
    "zone" TEXT,
    "seats" INTEGER NOT NULL DEFAULT 10,
    "price" DECIMAL NOT NULL DEFAULT 4000,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE'
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerName" TEXT NOT NULL,
    "batch" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "lineId" TEXT,
    "tableId" INTEGER NOT NULL,
    "slipUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING_PAYMENT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Booking_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Table_number_key" ON "Table"("number");
