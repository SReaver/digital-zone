-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "availability" BOOLEAN NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL, 
    "category" TEXT NOT NULL,  -- New field
    "stock" INTEGER NOT NULL,  -- New field
    "rating" DOUBLE PRECISION  -- New field
);

-- Insert initial data
INSERT INTO "Product" (
    name, 
    description, 
    price, 
    currency, 
    availability, 
    "lastUpdated",
    category,  -- New field
    stock,     -- New field
    rating     -- New field
) VALUES
('Advanced Python Course', 'Learn Python from scratch', 99.99, 'USD', true, CURRENT_TIMESTAMP, 'Programming', 100, 4.5),
('Java Essentials', 'Master Java with hands-on projects', 79.99, 'USD', true, CURRENT_TIMESTAMP, 'Programming', 200, 4.7),
('Vue.js for Beginners', 'Build dynamic web applications with Vue.js', 89.99, 'USD', true, CURRENT_TIMESTAMP, 'Web Development', 150, 4.6),
('Django in Action', 'Learn server-side development with Django', 109.99, 'USD', true, CURRENT_TIMESTAMP, 'Web Development', 120, 4.8),
('Full-Stack Development with MERN', 'Become a full-stack developer with this comprehensive course', 149.99, 'USD', true, CURRENT_TIMESTAMP, 'Full-Stack', 80, 4.9),
('HTML & CSS Mastery', 'Advanced techniques for modern web design', 59.99, 'USD', true, CURRENT_TIMESTAMP, 'Web Design', 300, 4.4);