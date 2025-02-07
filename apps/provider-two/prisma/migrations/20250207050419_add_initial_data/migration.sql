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
('provider-two-p7', 'Python for Data Science', 'Learn Python and its applications in data science', 129.99, 'USD', true, CURRENT_TIMESTAMP, 'provider-two', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('provider-two-p8', 'Machine Learning Basics', 'Introduction to machine learning concepts and techniques', 139.99, 'USD', true, CURRENT_TIMESTAMP, 'provider-two', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('provider-two-p9', 'Deep Learning with TensorFlow', 'Master deep learning with TensorFlow', 149.99, 'USD', true, CURRENT_TIMESTAMP, 'provider-two', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
