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
('Advanced TypeScript Course', 'Learn TypeScript from scratch', 99.99, 'USD', true, CURRENT_TIMESTAMP),
('JavaScript Essentials', 'Master JavaScript with hands-on projects', 79.99, 'USD', true, CURRENT_TIMESTAMP),
('React for Beginners', 'Build dynamic web applications with React', 89.99, 'USD', true, CURRENT_TIMESTAMP),
('Node.js in Action', 'Learn server-side development with Node.js', 109.99, 'USD', true, CURRENT_TIMESTAMP),
('Full-Stack Development', 'Become a full-stack developer with this comprehensive course', 149.99, 'USD', true, CURRENT_TIMESTAMP),
('CSS Mastery', 'Advanced techniques for modern web design', 59.99, 'USD', true, CURRENT_TIMESTAMP);