-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "availability" BOOLEAN NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL
);

-- Insert initial data
INSERT INTO "Product" (
    name, 
    description, 
    price, 
    currency, 
    availability, 
    "lastUpdated"
) VALUES
('Python for Data Science', 'Learn Python and its applications in data science', 129.99, 'USD', true, CURRENT_TIMESTAMP),
('Machine Learning Basics', 'Introduction to machine learning concepts and techniques', 139.99, 'USD', true, CURRENT_TIMESTAMP),
('Deep Learning with TensorFlow', 'Master deep learning with TensorFlow', 149.99, 'USD', true, CURRENT_TIMESTAMP);
