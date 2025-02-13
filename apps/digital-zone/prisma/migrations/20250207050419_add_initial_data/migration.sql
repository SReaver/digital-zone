-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "availability" BOOLEAN NOT NULL,
    "provider" TEXT NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "productId" INT NOT NULL
);

-- Add unique constraint first
ALTER TABLE "Product" ADD CONSTRAINT "productId_provider" UNIQUE ("productId", "provider");

-- Create indexes for Product
CREATE INDEX "Product_provider_idx" ON "Product"("provider");

-- Now create PriceHistory with the foreign key
CREATE TABLE "PriceHistory" (
    "id" SERIAL PRIMARY KEY,
    "productId" INT NOT NULL,
    "oldPrice" DOUBLE PRECISION NOT NULL,
    "newPrice" DOUBLE PRECISION NOT NULL,
    "oldAvailability" BOOLEAN NOT NULL,
    "newAvailability" BOOLEAN NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "provider" TEXT NOT NULL,
    CONSTRAINT "PriceHistory_productId_provider_fkey" FOREIGN KEY ("productId", "provider") 
        REFERENCES "Product"("productId", "provider") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create indexes for PriceHistory
CREATE INDEX "PriceHistory_productId_idx" ON "PriceHistory"("productId");
CREATE INDEX "PriceHistory_provider_idx" ON "PriceHistory"("provider");
