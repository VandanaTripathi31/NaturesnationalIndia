-- Tables for the Natures Natural backend (MariaDB 10.11 / MySQL 8).
-- Safe to import repeatedly: CREATE TABLE IF NOT EXISTS only, no DROP.
-- Array/object fields (benefits, images, tags, ...) are LONGTEXT holding JSON;
-- the Sequelize models encode/decode them.

CREATE TABLE IF NOT EXISTS admins (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  mongoId VARCHAR(24) NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  createdAt DATETIME(3) NOT NULL,
  updatedAt DATETIME(3) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admins_email (email),
  UNIQUE KEY uq_admins_mongoId (mongoId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS categories (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  mongoId VARCHAR(24) NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT NULL,
  content LONGTEXT NULL,
  image LONGTEXT NULL,
  metaTitle VARCHAR(255) NULL,
  metaDescription VARCHAR(255) NULL,
  metaKeywords VARCHAR(255) NULL,
  isActive TINYINT(1) NOT NULL DEFAULT 1,
  legacyId INT NULL,
  previousSlugs LONGTEXT NULL,
  createdAt DATETIME(3) NOT NULL,
  updatedAt DATETIME(3) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_name (name),
  UNIQUE KEY uq_categories_slug (slug),
  UNIQUE KEY uq_categories_legacyId (legacyId),
  UNIQUE KEY uq_categories_mongoId (mongoId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS products (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  mongoId VARCHAR(24) NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT NULL,
  botanicalName VARCHAR(255) NULL,
  origin VARCHAR(255) NULL,
  extractionMethod VARCHAR(255) NULL,
  benefits LONGTEXT NULL,
  uses LONGTEXT NULL,
  featured TINYINT(1) NOT NULL DEFAULT 0,
  categoryId INT UNSIGNED NOT NULL,
  images LONGTEXT NULL,
  metaTitle VARCHAR(255) NULL,
  metaDescription VARCHAR(255) NULL,
  metaKeywords VARCHAR(255) NULL,
  isActive TINYINT(1) NOT NULL DEFAULT 1,
  productCode VARCHAR(255) NULL,
  overview LONGTEXT NULL,
  blendsWith LONGTEXT NULL,
  history LONGTEXT NULL,
  storage LONGTEXT NULL,
  precautions LONGTEXT NULL,
  faqs LONGTEXT NULL,
  specifications LONGTEXT NULL,
  legacyId INT NULL,
  previousSlugs LONGTEXT NULL,
  createdAt DATETIME(3) NOT NULL,
  updatedAt DATETIME(3) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_products_slug (slug),
  UNIQUE KEY uq_products_legacyId (legacyId),
  UNIQUE KEY uq_products_mongoId (mongoId),
  KEY ix_products_category_active (categoryId, isActive),
  KEY ix_products_featured_active (featured, isActive),
  CONSTRAINT fk_products_category FOREIGN KEY (categoryId) REFERENCES categories (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS blog_categories (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  mongoId VARCHAR(24) NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  metaTitle VARCHAR(255) NULL,
  metaDescription VARCHAR(255) NULL,
  metaKeywords VARCHAR(255) NULL,
  sortOrder INT NOT NULL DEFAULT 0,
  isActive TINYINT(1) NOT NULL DEFAULT 1,
  legacyId INT NULL,
  createdAt DATETIME(3) NOT NULL,
  updatedAt DATETIME(3) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_blog_categories_slug (slug),
  UNIQUE KEY uq_blog_categories_legacyId (legacyId),
  UNIQUE KEY uq_blog_categories_mongoId (mongoId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Blog slugs are case-sensitive (legacy Magento identifiers keep their case),
-- so the slug column uses a binary collation.
CREATE TABLE IF NOT EXISTS blogs (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  mongoId VARCHAR(24) NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  content LONGTEXT NULL,
  excerpt TEXT NULL,
  image LONGTEXT NULL,
  author VARCHAR(255) NULL DEFAULT 'Natures Natural',
  tags LONGTEXT NULL,
  metaTitle VARCHAR(255) NULL,
  metaDescription VARCHAR(255) NULL,
  metaKeywords VARCHAR(255) NULL,
  isActive TINYINT(1) NOT NULL DEFAULT 1,
  publishedAt DATETIME(3) NULL,
  legacyId INT NULL,
  createdAt DATETIME(3) NOT NULL,
  updatedAt DATETIME(3) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_blogs_slug (slug),
  UNIQUE KEY uq_blogs_legacyId (legacyId),
  UNIQUE KEY uq_blogs_mongoId (mongoId),
  KEY ix_blogs_active_published (isActive, publishedAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS blog_blog_categories (
  blogId INT UNSIGNED NOT NULL,
  blogCategoryId INT UNSIGNED NOT NULL,
  PRIMARY KEY (blogId, blogCategoryId),
  CONSTRAINT fk_bbc_blog FOREIGN KEY (blogId) REFERENCES blogs (id) ON DELETE CASCADE,
  CONSTRAINT fk_bbc_category FOREIGN KEY (blogCategoryId) REFERENCES blog_categories (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS enquiries (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  mongoId VARCHAR(24) NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NULL,
  country VARCHAR(255) NULL,
  category VARCHAR(255) NULL,
  quantity VARCHAR(255) NULL,
  message TEXT NULL,
  source VARCHAR(255) NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'new',
  createdAt DATETIME(3) NOT NULL,
  updatedAt DATETIME(3) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_enquiries_mongoId (mongoId),
  KEY ix_enquiries_created (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
