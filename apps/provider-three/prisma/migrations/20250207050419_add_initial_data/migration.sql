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
('provider-three-p1', 'Advanced Python Course', 'Learn Python from scratch', 99.99, 'USD', true, CURRENT_TIMESTAMP, 'provider-three', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('provider-three-p2', 'Java Essentials', 'Master Java with hands-on projects', 79.99, 'USD', true, CURRENT_TIMESTAMP, 'provider-three', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('provider-three-p3', 'Vue.js for Beginners', 'Build dynamic web applications with Vue.js', 89.99, 'USD', true, CURRENT_TIMESTAMP, 'provider-three', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('provider-three-p4', 'Django in Action', 'Learn server-side development with Django', 109.99, 'USD', true, CURRENT_TIMESTAMP, 'provider-three', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('provider-three-p5', 'Full-Stack Development with MERN', 'Become a full-stack developer with this comprehensive course', 149.99, 'USD', true, CURRENT_TIMESTAMP, 'provider-three', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('provider-three-p6', 'HTML & CSS Mastery', 'Advanced techniques for modern web design', 59.99, 'USD', true, CURRENT_TIMESTAMP, 'provider-three', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);