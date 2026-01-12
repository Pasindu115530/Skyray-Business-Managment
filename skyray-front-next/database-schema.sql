-- Database schema for Skyray Business Management System
-- Admin Dashboard Tables

-- Users table (for customers and admin)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'customer') DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Quotations table
CREATE TABLE IF NOT EXISTS quotations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  service VARCHAR(255) NOT NULL,
  description TEXT,
  amount DECIMAL(10, 2) DEFAULT 0.00,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  admin_notes TEXT,
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  client_name VARCHAR(255),
  status ENUM('planning', 'in-progress', 'completed', 'on-hold') DEFAULT 'planning',
  start_date DATE,
  end_date DATE,
  budget DECIMAL(10, 2),
  quotation_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (quotation_id) REFERENCES quotations(id) ON DELETE SET NULL
);

-- Insert sample data for testing (optional)

-- Insert admin user
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@skyray.com', '$2a$10$hashedpassword', 'admin');

-- Insert sample customers
INSERT INTO users (name, email, password, role) VALUES 
('John Doe', 'john@example.com', '$2a$10$hashedpassword', 'customer'),
('Jane Smith', 'jane@example.com', '$2a$10$hashedpassword', 'customer'),
('Mike Johnson', 'mike@example.com', '$2a$10$hashedpassword', 'customer'),
('Sarah Williams', 'sarah@example.com', '$2a$10$hashedpassword', 'customer'),
('David Brown', 'david@example.com', '$2a$10$hashedpassword', 'customer');

-- Insert sample quotations
INSERT INTO quotations (customer_name, email, phone, service, description, amount, status, user_id) VALUES 
('John Doe', 'john@example.com', '9876543210', 'Web Development', 'E-commerce website development', 150000.00, 'approved', 2),
('Jane Smith', 'jane@example.com', '9876543211', 'Mobile App Development', 'iOS and Android app', 250000.00, 'pending', 3),
('Mike Johnson', 'mike@example.com', '9876543212', 'Digital Marketing', 'SEO and social media marketing', 75000.00, 'approved', 4),
('Sarah Williams', 'sarah@example.com', '9876543213', 'Cloud Services', 'AWS cloud infrastructure setup', 120000.00, 'pending', 5),
('David Brown', 'david@example.com', '9876543214', 'UI/UX Design', 'Website redesign project', 80000.00, 'rejected', 6),
('John Doe', 'john@example.com', '9876543210', 'Maintenance', 'Annual website maintenance', 50000.00, 'approved', 2),
('Jane Smith', 'jane@example.com', '9876543211', 'Consulting', 'IT consulting services', 100000.00, 'pending', 3),
('Mike Johnson', 'mike@example.com', '9876543212', 'Data Analytics', 'Business intelligence dashboard', 180000.00, 'pending', 4),
('Sarah Williams', 'sarah@example.com', '9876543213', 'Security Audit', 'Security assessment and audit', 90000.00, 'rejected', 5),
('David Brown', 'david@example.com', '9876543214', 'Training', 'Staff training program', 60000.00, 'approved', 6);

-- Insert sample projects
INSERT INTO projects (title, description, client_name, status, start_date, budget, quotation_id) VALUES 
('E-commerce Platform', 'Full-stack e-commerce solution', 'John Doe', 'in-progress', '2026-01-01', 150000.00, 1),
('Mobile Banking App', 'Secure mobile banking application', 'Jane Smith', 'planning', '2026-02-01', 250000.00, 2),
('SEO Campaign', 'Complete SEO optimization', 'Mike Johnson', 'completed', '2025-12-01', 75000.00, 3),
('Website Maintenance', 'Ongoing website support', 'John Doe', 'in-progress', '2026-01-15', 50000.00, 6);

-- Create indexes for better performance
CREATE INDEX idx_quotations_status ON quotations(status);
CREATE INDEX idx_quotations_created_at ON quotations(created_at);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_projects_status ON projects(status);
