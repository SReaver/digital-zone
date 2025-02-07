-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "availability" BOOLEAN NOT NULL,
    "providerId" TEXT NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Product_providerId_idx" ON "Product"("providerId");

-- Insert initial data
INSERT INTO "Product" (
    id, 
    name, 
    description, 
    price, 
    currency, 
    availability, 
    "lastUpdated", 
    "providerId",
    "createdAt",
    "updatedAt"
) VALUES
('provider-one-p1', 'Advanced TypeScript Course', 'Learn TypeScript from scratch', 99.99, 'USD', true, CURRENT_TIMESTAMP, 'provider-one', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('provider-one-p2', 'JavaScript Essentials', 'Master JavaScript with hands-on projects', 79.99, 'USD', true, CURRENT_TIMESTAMP, 'provider-one', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('provider-one-p3', 'React for Beginners', 'Build dynamic web applications with React', 89.99, 'USD', true, CURRENT_TIMESTAMP, 'provider-one', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('provider-one-p4', 'Node.js in Action', 'Learn server-side development with Node.js', 109.99, 'USD', true, CURRENT_TIMESTAMP, 'provider-one', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('provider-one-p5', 'Full-Stack Development', 'Become a full-stack developer with this comprehensive course', 149.99, 'USD', true, CURRENT_TIMESTAMP, 'provider-one', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('provider-one-p6', 'CSS Mastery', 'Advanced techniques for modern web design', 59.99, 'USD', true, CURRENT_TIMESTAMP, 'provider-one', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);