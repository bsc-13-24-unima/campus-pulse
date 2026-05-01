-- Drop tables if they exist (run in reverse dependency order)
DROP TABLE claims CASCADE CONSTRAINTS;
DROP TABLE lost_found_items CASCADE CONSTRAINTS;
DROP TABLE announcements CASCADE CONSTRAINTS;
DROP TABLE users CASCADE CONSTRAINTS;

-- USERS TABLE
CREATE TABLE users (
  user_id     NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name   VARCHAR2(255) NOT NULL,
  email       VARCHAR2(255) NOT NULL UNIQUE,
  password_hash VARCHAR2(255) NOT NULL,
  role        VARCHAR2(50) DEFAULT 'student' NOT NULL,
  is_active   NUMBER(1) DEFAULT 1 NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- LOST AND FOUND ITEMS TABLE
CREATE TABLE lost_found_items (
  item_id                   NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title                     VARCHAR2(255) NOT NULL,
  description               CLOB NOT NULL,
  category                  VARCHAR2(100) NOT NULL,
  item_type                 VARCHAR2(10) NOT NULL,
  location_info             VARCHAR2(255),
  status                    VARCHAR2(50) DEFAULT 'active' NOT NULL,
  posted_by_user_id         NUMBER NOT NULL,
  photo_url                 VARCHAR2(500),
  verification_question     VARCHAR2(500) NOT NULL,
  verification_answer_hash  VARCHAR2(255) NOT NULL,
  date_reported             TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  archived_at               TIMESTAMP,
  CONSTRAINT fk_item_user FOREIGN KEY (posted_by_user_id) REFERENCES users(user_id)
);

-- CLAIMS TABLE
CREATE TABLE claims (
  claim_id              NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  item_id               NUMBER NOT NULL,
  claimed_by_user_id    NUMBER NOT NULL,
  claim_status          VARCHAR2(50) DEFAULT 'pending' NOT NULL,
  submitted_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  reviewed_at           TIMESTAMP,
  reviewer_notes        VARCHAR2(1000),
  reviewed_by_user_id   NUMBER,
  CONSTRAINT fk_claim_item FOREIGN KEY (item_id) REFERENCES lost_found_items(item_id),
  CONSTRAINT fk_claim_user FOREIGN KEY (claimed_by_user_id) REFERENCES users(user_id)
);

-- ANNOUNCEMENTS TABLE
CREATE TABLE announcements (
  announcement_id     NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title               VARCHAR2(255) NOT NULL,
  content             CLOB NOT NULL,
  posted_by_user_id   NUMBER NOT NULL,
  target_audience     VARCHAR2(50) DEFAULT 'all' NOT NULL,
  is_active           NUMBER(1) DEFAULT 1 NOT NULL,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT fk_announcement_user FOREIGN KEY (posted_by_user_id) REFERENCES users(user_id)
);

-- Insert a default admin user (password: Admin123)
INSERT INTO users (full_name, email, password_hash, role)
VALUES (
  'System Administrator',
  'admin@unima.ac.mw',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'admin'
);

COMMIT;