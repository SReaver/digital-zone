-- DROP DATABASE IF EXISTS products;
-- CREATE DATABASE products;
-- USE products;
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;

-- CreateDatabases
DROP DATABASE IF EXISTS "provider-one-db";
CREATE DATABASE "provider-one-db";

DROP DATABASE IF EXISTS "provider-two-db";
CREATE DATABASE "provider-two-db";

DROP DATABASE IF EXISTS "provider-three-db";
CREATE DATABASE "provider-three-db";
