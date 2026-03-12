# GST Billing SaaS - Backend Specification

**Project:** GST Billing Invoice Management System  
**Frontend Framework:** Next.js 16 (TypeScript, React 19)  
**Backend Framework:** NestJS (Recommended)  
**Database:** PostgreSQL  
**API Style:** REST with JSON  
**Version:** 1.0.0

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Technology Stack](#technology-stack)
4. [Database Schema](#database-schema)
5. [API Specification](#api-specification)
6. [Authentication & Authorization](#authentication--authorization)
7. [Business Logic](#business-logic)
8. [Error Handling](#error-handling)
9. [Security Requirements](#security-requirements)
10. [Performance & Scalability](#performance--scalability)
11. [Deployment & DevOps](#deployment--devops)

---

## Executive Summary

This document outlines the complete backend architecture and API specification for a GST (Goods and Services Tax) billing and invoice management SaaS platform. The system enables businesses to:

- Manage customer information
- Maintain product/service catalogs with GST rates
- Create and track invoices with automated GST calculations
- Generate downloadable PDF invoices
- Configure company-specific settings (GSTIN, business details)
- Manage user authentication and authorization

The backend will be built as a scalable, secure REST API using NestJS with PostgreSQL as the primary database.

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js 16)                       │
│              (React, TypeScript, TailwindCSS)                   │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS REST API
                         │ (Axios Client)
┌────────────────────────▼────────────────────────────────────────┐
│                   API Gateway / Load Balancer                   │
│                    (Optional: AWS ALB/NLB)                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    NestJS Backend Server                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            REST API Endpoints (Controller Layer)         │  │
│  │  - /auth/*           (Authentication)                    │  │
│  │  - /customers/*      (Customer Management)               │  │
│  │  - /products/*       (Product/Service Catalog)           │  │
│  │  - /invoices/*       (Invoice Management)                │  │
│  │  - /settings/*       (User/Company Settings)             │  │
│  │  - /reports/*        (Business Reports - Future)         │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          Service Layer (Business Logic)                  │  │
│  │  - AuthService       (JWT, session management)           │  │
│  │  - CustomerService   (CRUD, validation)                  │  │
│  │  - ProductService    (CRUD, GST management)              │  │
│  │  - InvoiceService    (Creation, GST calculations)        │  │
│  │  - PdfService        (PDF generation)                    │  │
│  │  - SettingsService   (Company configuration)             │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │        Repository/Data Access Layer (TypeORM)            │  │
│  │  - TypeORM Entities  (Database models)                   │  │
│  │  - Repositories      (CRUD operations)                   │  │
│  │  - Query Builders    (Complex queries)                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────┬─────────────────────────────────────────────────────┘
             │
┌────────────▼────────────────────────────────────────────────────┐
│                     PostgreSQL Database                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Tables:                                                 │  │
│  │  - users              (Authentication & user data)       │  │
│  │  - customers          (Customer records)                 │  │
│  │  - products           (Product/service catalog)          │  │
│  │  - invoices           (Invoice headers)                  │  │
│  │  - invoice_items      (Invoice line items)               │  │
│  │  - company_settings   (Company/tenant configuration)     │  │
│  │  - audit_logs         (Compliance tracking)              │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    External Services                            │
│  - Email Service       (Transactional emails)                  │
│  - PDF Generator       (Invoice PDFs - PDFKit/wkhtmltopdf)     │
│  - Cloud Storage       (AWS S3 for PDFs, logos)                │
│  - Logging Service     (ELK Stack / CloudWatch)                │
│  - Monitoring          (Prometheus / Datadog)                  │
└─────────────────────────────────────────────────────────────────┘
```

### Key Architectural Principles

- **Layered Architecture:** Separation of concerns (Controller → Service → Repository)
- **RESTful Design:** Standard HTTP methods and status codes
- **Stateless API:** JWT-based authentication for scalability
- **Database Normalization:** Proper schema design to avoid data redundancy
- **Business Logic Isolation:** Complex calculations in services, not controllers
- **Error Handling:** Consistent error responses with meaningful messages
- **Logging & Monitoring:** Comprehensive audit trails and performance metrics

---

## Technology Stack

### Backend Framework & Runtime
- **Runtime:** Node.js 18+ (LTS)
- **Framework:** NestJS 10+ (TypeScript framework)
- **Language:** TypeScript 5+
- **Package Manager:** npm or pnpm

### Database & ORM
- **Database:** PostgreSQL 13+ (Production)
  - SQLite3 (Development/Testing - optional)
- **ORM:** TypeORM 0.3+
- **Migrations:** TypeORM migrations or Hasura

### Authentication & Security
- **JWT Library:** @nestjs/jwt + jsonwebtoken
- **Password Hashing:** bcrypt
- **CORS:** @nestjs/common (built-in)
- **Rate Limiting:** @nestjs/throttler
- **Validation:** class-validator + class-transformer

### External Libraries
- **PDF Generation:** pdfkit or wkhtmltopdf wrapper
- **File Upload:** multer + aws-sdk (for S3)
- **Email:** nodemailer or SendGrid
- **Logging:** winston or pino
- **HTTP Client:** axios (for external APIs)

### Development & Testing
- **Testing Framework:** Jest
- **E2E Testing:** Supertest
- **API Documentation:** Swagger/OpenAPI (via @nestjs/swagger)
- **Linting:** ESLint
- **Code Formatting:** Prettier

### DevOps & Deployment
- **Containerization:** Docker
- **Orchestration:** Kubernetes (optional) or Docker Compose
- **CI/CD:** GitHub Actions / GitLab CI
- **Hosting:** AWS EC2 / ECS, DigitalOcean, Heroku, or Vercel Functions

---

## Database Schema

### Entity Relationship Diagram

```
users (1) ──────── (N) customers
  │                     │
  │                     └──── (N) invoices
  │                            └── (N) invoice_items
  │                                └── (1) products
  │
  └──── (1) company_settings

products (1) ────── (N) invoice_items (N) ──── (1) invoices
```

### Database Tables & Columns

#### 1. **users** Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  avatar_url VARCHAR(500),
  role ENUM('admin', 'user') DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP (soft delete)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_active ON users(is_active);
```

#### 2. **company_settings** Table
```sql
CREATE TABLE company_settings (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  company_name VARCHAR(255) NOT NULL,
  gstin VARCHAR(15) UNIQUE,
  pan VARCHAR(10),
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(255),
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(10),
  country VARCHAR(100) DEFAULT 'India',
  logo_url VARCHAR(500),
  bank_account_number VARCHAR(20),
  bank_name VARCHAR(100),
  ifsc_code VARCHAR(11),
  terms_and_conditions TEXT,
  is_invoice_enabled BOOLEAN DEFAULT true,
  invoice_prefix VARCHAR(10) DEFAULT 'INV',
  invoice_next_number INT DEFAULT 1001,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_company_settings_user_id ON company_settings(user_id);
```

#### 3. **customers** Table
```sql
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  gstin VARCHAR(15),
  pan VARCHAR(10),
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(10),
  country VARCHAR(100) DEFAULT 'India',
  contact_person VARCHAR(100),
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  credit_limit DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP (soft delete),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_gstin ON customers(gstin);
CREATE INDEX idx_customers_is_active ON customers(is_active);
```

#### 4. **products** Table
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  hsn_code VARCHAR(8),
  sac_code VARCHAR(6),
  unit ENUM('pc', 'kg', 'liter', 'meter', 'box', 'dozen', 'hour', 'service') DEFAULT 'pc',
  price DECIMAL(12,2) NOT NULL,
  gst_rate DECIMAL(5,2) DEFAULT 0,
  cgst_rate DECIMAL(5,2),
  sgst_rate DECIMAL(5,2),
  igst_rate DECIMAL(5,2),
  cess_rate DECIMAL(5,2) DEFAULT 0,
  sku VARCHAR(100),
  quantity_in_stock INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP (soft delete),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_products_hsn_code ON products(hsn_code);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_is_active ON products(is_active);
```

#### 5. **invoices** Table
```sql
CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  customer_id INT NOT NULL,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  invoice_date DATE NOT NULL,
  due_date DATE,
  status ENUM('draft', 'sent', 'viewed', 'paid', 'cancelled', 'overdue') DEFAULT 'draft',
  subtotal DECIMAL(14,2) NOT NULL,
  cgst_amount DECIMAL(12,2) DEFAULT 0,
  sgst_amount DECIMAL(12,2) DEFAULT 0,
  igst_amount DECIMAL(12,2) DEFAULT 0,
  cess_amount DECIMAL(12,2) DEFAULT 0,
  total_tax_amount DECIMAL(12,2) NOT NULL,
  total_amount DECIMAL(14,2) NOT NULL,
  discount_type ENUM('percentage', 'fixed') DEFAULT 'fixed',
  discount_value DECIMAL(12,2) DEFAULT 0,
  notes TEXT,
  terms_and_conditions TEXT,
  payment_terms VARCHAR(100),
  reference_number VARCHAR(100),
  reverse_charge BOOLEAN DEFAULT false,
  is_sent BOOLEAN DEFAULT false,
  sent_date TIMESTAMP,
  is_paid BOOLEAN DEFAULT false,
  paid_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP (soft delete),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT
);

CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_invoice_date ON invoices(invoice_date);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
```

#### 6. **invoice_items** Table
```sql
CREATE TABLE invoice_items (
  id SERIAL PRIMARY KEY,
  invoice_id INT NOT NULL,
  product_id INT NOT NULL,
  description VARCHAR(500),
  hsn_code VARCHAR(8),
  unit ENUM('pc', 'kg', 'liter', 'meter', 'box', 'dozen', 'hour', 'service') NOT NULL,
  quantity DECIMAL(10,4) NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  line_total DECIMAL(14,2) NOT NULL,
  gst_rate DECIMAL(5,2) DEFAULT 0,
  cgst_rate DECIMAL(5,2),
  sgst_rate DECIMAL(5,2),
  igst_rate DECIMAL(5,2),
  cgst_amount DECIMAL(12,2) DEFAULT 0,
  sgst_amount DECIMAL(12,2) DEFAULT 0,
  igst_amount DECIMAL(12,2) DEFAULT 0,
  cess_rate DECIMAL(5,2) DEFAULT 0,
  cess_amount DECIMAL(12,2) DEFAULT 0,
  item_total_with_tax DECIMAL(14,2) NOT NULL,
  notes TEXT,
  sequence_number INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX idx_invoice_items_product_id ON invoice_items(product_id);
```

#### 7. **audit_logs** Table
```sql
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INT,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INT NOT NULL,
  action ENUM('create', 'update', 'delete', 'view') NOT NULL,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

#### 8. **refresh_tokens** Table (for JWT refresh token management)
```sql
CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(500) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  revoked BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);
```

---

## API Specification

### Base URL
```
http://localhost:3001/api
or
https://api.yourdomain.com/api (Production)
```

### Response Format

All responses follow a consistent JSON format:

**Success Response (2xx):**
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful"
}
```

**Error Response (4xx, 5xx):**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { /* additional error context */ }
  }
}
```

### Standard HTTP Status Codes
- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `204 No Content` - Request succeeded, no content to return
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Authenticated but not authorized
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists (duplicate)
- `422 Unprocessable Entity` - Validation errors
- `500 Internal Server Error` - Server error

---

### 1. Authentication Endpoints

#### POST /auth/register
**Register a new user account**

```
Request:
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "first_name": "John",
  "last_name": "Doe"
}

Response (201 Created):
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe"
  },
  "message": "User registered successfully"
}

Error (400 Bad Request):
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email already registered"
  }
}
```

**Validation Rules:**
- Email must be valid and unique
- Password must be at least 8 characters with uppercase, lowercase, number, and special character
- First name and last name required

---

#### POST /auth/login
**Authenticate user and receive tokens**

```
Request:
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

Response (200 OK):
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "user"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600
  },
  "message": "Login successful"
}

Error (401 Unauthorized):
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

**Token Details:**
- `access_token`: JWT valid for 1 hour
- `refresh_token`: JWT valid for 7 days, stored in database
- Frontend stores both in memory/localStorage

---

#### POST /auth/refresh
**Refresh access token using refresh token**

```
Request:
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response (200 OK):
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600
  }
}
```

---

#### POST /auth/logout
**Logout user and revoke refresh token**

```
Request:
POST /auth/logout
Authorization: Bearer <access_token>

Response (200 OK):
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### POST /auth/forgot-password
**Request password reset email**

```
Request:
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}

Response (200 OK):
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

#### POST /auth/reset-password
**Reset password with token from email**

```
Request:
POST /auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-from-email",
  "password": "NewSecurePassword123!"
}

Response (200 OK):
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

### 2. Customers Endpoints

#### GET /customers
**List all customers**

```
Request:
GET /customers?page=1&limit=10&search=John&sort=name&order=asc
Authorization: Bearer <access_token>

Query Parameters:
- page (default: 1)
- limit (default: 10, max: 100)
- search (optional, searches in name/email/phone)
- sort (optional: created_at, name, email - default: created_at)
- order (asc|desc - default: desc)
- is_active (optional: true|false)

Response (200 OK):
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "name": "John Enterprises",
        "email": "john@example.com",
        "phone": "+91-9999999999",
        "gstin": "27AADCB1234F2Z0",
        "city": "Mumbai",
        "state": "Maharashtra",
        "is_active": true,
        "created_at": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "total_pages": 5
    }
  }
}
```

---

#### POST /customers
**Create a new customer**

```
Request:
POST /customers
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "ABC Company Pvt Ltd",
  "email": "contact@abc.com",
  "phone": "+91-9876543210",
  "gstin": "27AADCB1234F2Z0",
  "pan": "AAAPD1234A",
  "address_line1": "123 Business Street",
  "address_line2": "Building A, Floor 5",
  "city": "Mumbai",
  "state": "Maharashtra",
  "postal_code": "400001",
  "contact_person": "Rajesh Kumar",
  "notes": "Established customer"
}

Response (201 Created):
{
  "success": true,
  "data": {
    "id": 2,
    "user_id": 1,
    "name": "ABC Company Pvt Ltd",
    "email": "contact@abc.com",
    "phone": "+91-9876543210",
    "gstin": "27AADCB1234F2Z0",
    "is_active": true,
    "created_at": "2024-01-20T14:45:00Z"
  },
  "message": "Customer created successfully"
}

Error (409 Conflict):
{
  "success": false,
  "error": {
    "code": "DUPLICATE_GSTIN",
    "message": "Customer with this GSTIN already exists"
  }
}
```

**Validation Rules:**
- Name: 2-255 characters, required
- Email: Valid email format, optional but unique if provided
- Phone: Valid format, optional
- GSTIN: 15-character format, optional but must be valid GST number format
- Address fields: Max 255 characters

---

#### GET /customers/:id
**Get customer details**

```
Request:
GET /customers/1
Authorization: Bearer <access_token>

Response (200 OK):
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Enterprises",
    "email": "john@example.com",
    "phone": "+91-9999999999",
    "gstin": "27AADCB1234F2Z0",
    "pan": "AAAPJ1234J",
    "address_line1": "456 Market Road",
    "address_line2": "Suite 200",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postal_code": "400002",
    "country": "India",
    "contact_person": "John Doe",
    "notes": "Regular customer",
    "credit_limit": 500000,
    "is_active": true,
    "total_invoices": 12,
    "total_amount_due": 150000,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-20T14:45:00Z"
  }
}

Error (404 Not Found):
{
  "success": false,
  "error": {
    "code": "CUSTOMER_NOT_FOUND",
    "message": "Customer with ID 999 not found"
  }
}
```

---

#### PUT /customers/:id
**Update customer details**

```
Request:
PUT /customers/1
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "John Enterprises Pvt Ltd",
  "email": "newemail@example.com",
  "phone": "+91-9999988888",
  "city": "Pune"
}

Response (200 OK):
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Enterprises Pvt Ltd",
    "email": "newemail@example.com",
    "phone": "+91-9999988888",
    "city": "Pune",
    /* ... all other fields ... */
    "updated_at": "2024-01-21T09:15:00Z"
  },
  "message": "Customer updated successfully"
}
```

---

#### DELETE /customers/:id
**Delete/deactivate a customer**

```
Request:
DELETE /customers/1
Authorization: Bearer <access_token>

Response (204 No Content):
(No response body)

Error (409 Conflict):
{
  "success": false,
  "error": {
    "code": "CUSTOMER_HAS_INVOICES",
    "message": "Cannot delete customer with existing invoices. Deactivate instead."
  }
}
```

---

### 3. Products Endpoints

#### GET /products
**List all products**

```
Request:
GET /products?page=1&limit=20&search=laptop&sort=name&order=asc
Authorization: Bearer <access_token>

Query Parameters:
- page (default: 1)
- limit (default: 20, max: 100)
- search (searches in name/hsn_code/sku)
- sort (name, price, gst_rate, created_at)
- order (asc|desc)
- is_active (optional: true|false)

Response (200 OK):
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "name": "Laptop",
        "hsn_code": "84713050",
        "unit": "pc",
        "price": 50000.00,
        "gst_rate": 18.00,
        "cgst_rate": 9.00,
        "sgst_rate": 9.00,
        "sku": "LAP-001",
        "quantity_in_stock": 15,
        "is_active": true,
        "created_at": "2024-01-10T11:20:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "total_pages": 3
    }
  }
}
```

---

#### POST /products
**Create a new product**

```
Request:
POST /products
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Laptop",
  "description": "High-performance laptop for business",
  "hsn_code": "84713050",
  "unit": "pc",
  "price": 50000.00,
  "gst_rate": 18.00,
  "cgst_rate": 9.00,
  "sgst_rate": 9.00,
  "sku": "LAP-001",
  "quantity_in_stock": 15
}

Response (201 Created):
{
  "success": true,
  "data": {
    "id": 5,
    "name": "Laptop",
    "hsn_code": "84713050",
    "price": 50000.00,
    "gst_rate": 18.00,
    "sku": "LAP-001",
    "is_active": true,
    "created_at": "2024-01-21T10:00:00Z"
  },
  "message": "Product created successfully"
}

Error (409 Conflict):
{
  "success": false,
  "error": {
    "code": "DUPLICATE_SKU",
    "message": "Product with SKU 'LAP-001' already exists"
  }
}
```

**Validation Rules:**
- Name: 2-255 characters, required
- Price: Positive decimal, required
- GST Rate: 0-100, validates against Indian GST slab rates
- HSN Code: 8-digit code for goods (optional)
- SAC Code: 6-digit code for services (optional)
- Unit: Must be one of predefined enums

---

#### GET /products/:id
**Get product details**

```
Request:
GET /products/1
Authorization: Bearer <access_token>

Response (200 OK):
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Laptop",
    "description": "High-performance laptop",
    "hsn_code": "84713050",
    "unit": "pc",
    "price": 50000.00,
    "gst_rate": 18.00,
    "cgst_rate": 9.00,
    "sgst_rate": 9.00,
    "cess_rate": 0.00,
    "sku": "LAP-001",
    "quantity_in_stock": 15,
    "is_active": true,
    "notes": "Popular product",
    "created_at": "2024-01-10T11:20:00Z"
  }
}
```

---

#### PUT /products/:id
**Update product details**

```
Request:
PUT /products/1
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Laptop Pro",
  "price": 55000.00,
  "quantity_in_stock": 20
}

Response (200 OK):
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Laptop Pro",
    "price": 55000.00,
    "quantity_in_stock": 20,
    /* ... all fields ... */
    "updated_at": "2024-01-21T10:30:00Z"
  },
  "message": "Product updated successfully"
}
```

---

#### DELETE /products/:id
**Delete/deactivate a product**

```
Request:
DELETE /products/1
Authorization: Bearer <access_token>

Response (204 No Content):
(No response body)

Error (409 Conflict):
{
  "success": false,
  "error": {
    "code": "PRODUCT_IN_USE",
    "message": "Cannot delete product used in invoices. Deactivate instead."
  }
}
```

---

### 4. Invoices Endpoints

#### GET /invoices
**List all invoices**

```
Request:
GET /invoices?page=1&limit=15&status=all&customer_id=1&sort=invoice_date&order=desc
Authorization: Bearer <access_token>

Query Parameters:
- page (default: 1)
- limit (default: 15, max: 50)
- status (draft|sent|viewed|paid|cancelled|overdue|all - default: all)
- customer_id (optional, filter by customer)
- invoice_date_from (optional, ISO format)
- invoice_date_to (optional, ISO format)
- sort (invoice_date, invoice_number, total_amount, status)
- order (asc|desc)

Response (200 OK):
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "invoice_number": "INV-001",
        "customer": {
          "id": 1,
          "name": "John Enterprises"
        },
        "invoice_date": "2024-01-20",
        "due_date": "2024-02-20",
        "status": "sent",
        "subtotal": 100000.00,
        "total_tax_amount": 18000.00,
        "total_amount": 118000.00,
        "is_paid": false,
        "is_sent": true,
        "created_at": "2024-01-20T14:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 15,
      "total": 28,
      "total_pages": 2
    },
    "summary": {
      "total_sent": 15,
      "total_paid": 8,
      "total_overdue": 2,
      "total_draft": 3
    }
  }
}
```

---

#### POST /invoices
**Create a new invoice**

```
Request:
POST /invoices
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "customer_id": 1,
  "invoice_date": "2024-01-20",
  "due_date": "2024-02-20",
  "status": "draft",
  "discount_type": "percentage",
  "discount_value": 5,
  "notes": "Payment terms: Net 30",
  "terms_and_conditions": "Standard T&C apply",
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "unit_price": 50000.00,
      "gst_rate": 18.00
    },
    {
      "product_id": 2,
      "quantity": 1,
      "unit_price": 25000.00,
      "gst_rate": 5.00
    }
  ]
}

Response (201 Created):
{
  "success": true,
  "data": {
    "id": 1,
    "invoice_number": "INV-1001",
    "customer_id": 1,
    "invoice_date": "2024-01-20",
    "due_date": "2024-02-20",
    "status": "draft",
    "subtotal": 125000.00,
    "cgst_amount": 5625.00,
    "sgst_amount": 5625.00,
    "total_tax_amount": 11250.00,
    "discount_value": 6250.00,
    "total_amount": 130000.00,
    "items": [
      {
        "id": 1,
        "product_id": 1,
        "quantity": 2,
        "unit_price": 50000.00,
        "gst_rate": 18.00,
        "cgst_amount": 4500.00,
        "sgst_amount": 4500.00,
        "item_total_with_tax": 109000.00
      }
    ],
    "created_at": "2024-01-20T14:30:00Z"
  },
  "message": "Invoice created successfully"
}

Error (400 Bad Request):
{
  "success": false,
  "error": {
    "code": "INVALID_INVOICE_DATA",
    "message": "Invoice must have at least one item",
    "details": {
      "items": ["At least one item is required"]
    }
  }
}
```

**Business Logic:**
- Auto-generate invoice number based on company settings (INV-1001, INV-1002, etc.)
- Calculate taxes based on product GST rates
- Support CGST/SGST (intra-state) and IGST (inter-state) automatically based on company and customer states
- Apply reverse charge if applicable (B2B with unregistered customer)
- Handle discounts (percentage or fixed amount)

---

#### GET /invoices/:id
**Get invoice details**

```
Request:
GET /invoices/1
Authorization: Bearer <access_token>

Response (200 OK):
{
  "success": true,
  "data": {
    "id": 1,
    "invoice_number": "INV-1001",
    "customer": {
      "id": 1,
      "name": "John Enterprises",
      "email": "john@example.com",
      "gstin": "27AADCB1234F2Z0",
      "address": "456 Market Road, Mumbai"
    },
    "company": {
      "name": "Your Company",
      "gstin": "27XXXXX1234F2Z0",
      "address": "Business Park, Mumbai"
    },
    "invoice_date": "2024-01-20",
    "due_date": "2024-02-20",
    "status": "draft",
    "items": [
      {
        "id": 1,
        "product": { "id": 1, "name": "Laptop", "hsn_code": "84713050" },
        "quantity": 2,
        "unit": "pc",
        "unit_price": 50000.00,
        "line_total": 100000.00,
        "gst_rate": 18.00,
        "cgst_rate": 9.00,
        "sgst_rate": 9.00,
        "cgst_amount": 4500.00,
        "sgst_amount": 4500.00,
        "item_total_with_tax": 109000.00
      }
    ],
    "subtotal": 100000.00,
    "cgst_amount": 4500.00,
    "sgst_amount": 4500.00,
    "igst_amount": 0.00,
    "cess_amount": 0.00,
    "total_tax_amount": 9000.00,
    "discount_type": "percentage",
    "discount_value": 5,
    "discount_amount": 5000.00,
    "total_amount": 104000.00,
    "is_paid": false,
    "is_sent": false,
    "notes": "Payment terms: Net 30",
    "created_at": "2024-01-20T14:30:00Z",
    "updated_at": "2024-01-20T14:30:00Z"
  }
}
```

---

#### PUT /invoices/:id
**Update invoice (only if draft)**

```
Request:
PUT /invoices/1
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "customer_id": 2,
  "due_date": "2024-02-25",
  "items": [
    {
      "product_id": 1,
      "quantity": 3,
      "unit_price": 50000.00,
      "gst_rate": 18.00
    }
  ]
}

Response (200 OK):
{
  "success": true,
  "data": { /* updated invoice data */ },
  "message": "Invoice updated successfully"
}

Error (409 Conflict):
{
  "success": false,
  "error": {
    "code": "CANNOT_EDIT_SENT_INVOICE",
    "message": "Cannot edit invoice that has been sent. Create a new invoice or use credit note."
  }
}
```

**Rules:**
- Only draft invoices can be edited
- Sent/paid invoices are immutable
- Must have at least one line item

---

#### POST /invoices/:id/send
**Send invoice to customer (email)**

```
Request:
POST /invoices/1/send
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "recipient_email": "john@example.com",
  "message": "Please find attached invoice for your review"
}

Response (200 OK):
{
  "success": true,
  "data": {
    "id": 1,
    "invoice_number": "INV-1001",
    "status": "sent",
    "is_sent": true,
    "sent_date": "2024-01-20T15:00:00Z"
  },
  "message": "Invoice sent successfully"
}

Triggers:
- Change invoice status to 'sent'
- Send email with PDF attachment
- Log audit trail
```

---

#### GET /invoices/:id/pdf
**Download invoice as PDF**

```
Request:
GET /invoices/1/pdf
Authorization: Bearer <access_token>

Response (200 OK):
Content-Type: application/pdf
Content-Disposition: attachment; filename="INV-1001.pdf"

(Binary PDF data)

Error (404 Not Found):
{
  "success": false,
  "error": {
    "code": "INVOICE_NOT_FOUND",
    "message": "Invoice not found"
  }
}
```

**PDF Generation:**
- Include company header with logo
- Invoice number, date, due date
- Customer and company GSTIN details
- Itemized line items with HSN codes
- GST breakdown (CGST, SGST, IGST)
- Payment terms and notes
- Company bank details
- Digital signature/stamp (if configured)

---

#### POST /invoices/:id/mark-paid
**Mark invoice as paid**

```
Request:
POST /invoices/1/mark-paid
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "payment_date": "2024-02-10",
  "payment_method": "bank_transfer",
  "reference_number": "TXN-123456",
  "notes": "Payment received"
}

Response (200 OK):
{
  "success": true,
  "data": {
    "id": 1,
    "is_paid": true,
    "paid_date": "2024-02-10",
    "status": "paid"
  },
  "message": "Invoice marked as paid"
}
```

---

#### DELETE /invoices/:id
**Delete invoice (only draft)**

```
Request:
DELETE /invoices/1
Authorization: Bearer <access_token>

Response (204 No Content):
(No response body)

Error (409 Conflict):
{
  "success": false,
  "error": {
    "code": "CANNOT_DELETE_SENT_INVOICE",
    "message": "Cannot delete sent invoice. Archive or create a credit note instead."
  }
}
```

---

### 5. Settings Endpoints

#### GET /settings
**Get company settings**

```
Request:
GET /settings
Authorization: Bearer <access_token>

Response (200 OK):
{
  "success": true,
  "data": {
    "id": 1,
    "company_name": "Your Business Pvt Ltd",
    "gstin": "27AADCB1234F2Z0",
    "pan": "AAAAP1234P",
    "phone": "+91-9876543210",
    "email": "contact@yourbusiness.com",
    "website": "https://yourbusiness.com",
    "address_line1": "Business Park",
    "address_line2": "Building A, Floor 5",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postal_code": "400001",
    "country": "India",
    "logo_url": "https://cdn.example.com/logo.png",
    "bank_account_number": "1234567890",
    "bank_name": "HDFC Bank",
    "ifsc_code": "HDFC0001234",
    "invoice_prefix": "INV",
    "invoice_next_number": 1001,
    "terms_and_conditions": "Standard T&C",
    "is_invoice_enabled": true
  }
}
```

---

#### PUT /settings
**Update company settings**

```
Request:
PUT /settings
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "company_name": "Your Updated Business",
  "phone": "+91-9876543211",
  "bank_account_number": "9876543210",
  "terms_and_conditions": "Updated T&C"
}

Response (200 OK):
{
  "success": true,
  "data": {
    /* updated settings */
  },
  "message": "Settings updated successfully"
}
```

**Rules:**
- GSTIN format validation (15 characters, valid GST format)
- Bank account validation (10-18 digits)
- IFSC code validation (11 characters)
- Logo upload to S3 if provided

---

#### POST /settings/logo
**Upload company logo**

```
Request:
POST /settings/logo
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

form-data:
  file: <binary image file>

Response (200 OK):
{
  "success": true,
  "data": {
    "logo_url": "https://cdn.example.com/logos/company-1-logo.png"
  },
  "message": "Logo uploaded successfully"
}

Error (400 Bad Request):
{
  "success": false,
  "error": {
    "code": "INVALID_FILE_TYPE",
    "message": "Only JPG, PNG, and WebP formats are allowed"
  }
}
```

**Validation:**
- Max file size: 5MB
- Allowed formats: JPG, PNG, WebP
- Auto-optimize and resize to standard dimensions

---

#### GET /settings/profile
**Get user profile**

```
Request:
GET /settings/profile
Authorization: Bearer <access_token>

Response (200 OK):
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+91-9876543210",
    "avatar_url": "https://cdn.example.com/avatars/user-1.jpg",
    "role": "user",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

---

#### PUT /settings/profile
**Update user profile**

```
Request:
PUT /settings/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Smith",
  "phone": "+91-9876543211"
}

Response (200 OK):
{
  "success": true,
  "data": {
    /* updated profile */
  },
  "message": "Profile updated successfully"
}
```

---

#### POST /settings/change-password
**Change user password**

```
Request:
POST /settings/change-password
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "current_password": "OldPassword123!",
  "new_password": "NewPassword456!",
  "confirm_password": "NewPassword456!"
}

Response (200 OK):
{
  "success": true,
  "message": "Password changed successfully"
}

Error (401 Unauthorized):
{
  "success": false,
  "error": {
    "code": "INVALID_CURRENT_PASSWORD",
    "message": "Current password is incorrect"
  }
}
```

---

## Authentication & Authorization

### JWT Token Structure

```javascript
// Access Token Payload (expires in 1 hour)
{
  sub: "user_id",
  email: "user@example.com",
  iat: 1705775400,
  exp: 1705779000,
  type: "access"
}

// Refresh Token Payload (expires in 7 days)
{
  sub: "user_id",
  iat: 1705775400,
  exp: 1706380200,
  type: "refresh"
}
```

### Authorization Strategy

- Use Bearer token in Authorization header: `Authorization: Bearer <token>`
- Validate JWT signature and expiration on every request
- Implement role-based access control (RBAC):
  - `admin`: Full system access
  - `user`: Limited to own data
- User can only access their own customers, products, invoices
- Implement endpoint-level authorization guards

### Security Best Practices

```typescript
// Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*)
- No common patterns (123456, password, etc.)

// Token Management
- Access tokens: Short-lived (1 hour)
- Refresh tokens: Longer-lived (7 days), stored in database
- Implement token rotation on refresh
- Blacklist/revoke tokens on logout
- Store refresh tokens securely in httpOnly cookies (optional)

// Password Hashing
- Use bcrypt with salt rounds 10+
- Never store plain text passwords
- Compare using secure comparison methods
```

---

## Business Logic

### GST Calculation Logic

**Indian GST Structure:**
- CGST (Central GST): Applicable for intra-state transactions
- SGST (State GST): Applicable for intra-state transactions
- IGST (Integrated GST): Applicable for inter-state transactions

```
GST Calculation Algorithm:

IF (Seller State == Buyer State):
  CGST = Item Price × (GST Rate / 2)
  SGST = Item Price × (GST Rate / 2)
  IGST = 0
ELSE:
  CGST = 0
  SGST = 0
  IGST = Item Price × GST Rate

Total Tax = CGST + SGST + IGST + CESS
Total Amount = (Item Price × Quantity) + Total Tax - Discount
```

**Common GST Rates (India):**
- 0% - Essential items (food grains, etc.)
- 5% - Essential items, services
- 12% - Processed foods, textiles
- 18% - Electronics, computers, services (most common)
- 28% - Luxury goods, vehicles
- Special rates for specific items

**Reverse Charge Mechanism:**
- Applicable when B2B supplier is unregistered
- Buyer liable for GST payment
- Flag: `reverse_charge: true`
- Validation: Seller GSTIN must be present, Buyer GSTIN must be absent or marked unregistered

### Invoice Number Generation

```typescript
// Sequential numbering based on company settings
next_invoice_number = company_settings.invoice_next_number
invoice_number = `${company_settings.invoice_prefix}-${next_invoice_number}`

// Update next number
company_settings.invoice_next_number += 1

// Example: INV-1001, INV-1002, INV-1003, ...
```

### Invoice Status Workflow

```
draft → sent → viewed → paid
         ↓
       cancelled

Special Status:
- overdue: sent AND due_date < today AND is_paid = false
```

### Discount Logic

```typescript
IF discount_type == 'percentage':
  discount_amount = subtotal × (discount_value / 100)
ELSE IF discount_type == 'fixed':
  discount_amount = discount_value

taxable_amount = subtotal - discount_amount
total_tax = (taxable_amount × gst_rate) / 100
total_amount = taxable_amount + total_tax
```

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {
      "field_name": "Specific error for this field"
    }
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| VALIDATION_ERROR | 422 | Request data validation failed |
| AUTHENTICATION_REQUIRED | 401 | Missing/invalid authentication token |
| UNAUTHORIZED | 403 | User lacks required permissions |
| RESOURCE_NOT_FOUND | 404 | Requested resource doesn't exist |
| DUPLICATE_RESOURCE | 409 | Resource already exists (email, GSTIN, etc.) |
| INVALID_STATE | 409 | Operation not allowed in current resource state |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| INTERNAL_SERVER_ERROR | 500 | Unexpected server error |

### Validation Errors

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {
      "email": "Invalid email format",
      "password": "Password must contain uppercase, lowercase, number, and special character",
      "items": "Invoice must have at least one item"
    }
  }
}
```

---

## Security Requirements

### Authentication
- Implement JWT-based authentication
- Use secure password hashing (bcrypt)
- Email verification for new registrations (optional but recommended)
- Two-factor authentication (future enhancement)

### Data Protection
- Use HTTPS/TLS for all API communications
- Encrypt sensitive data in transit and at rest
- Implement CORS properly (allow only frontend domain)
- SQL injection prevention through parameterized queries

### API Security
- Implement rate limiting (100 requests/minute per IP)
- Use API key validation for programmatic access
- Implement CSRF protection if using sessions
- Add request signing for sensitive operations
- Log all API access and changes

### Database Security
- Use connection pooling with credentials in environment variables
- Implement least privilege principle for DB users
- Regular backups with encryption
- Implement row-level security (RLS) if multi-tenant

### Audit & Compliance
- Log all user actions (create, update, delete)
- Maintain audit trail for compliance
- Implement soft deletes for data retention
- Regular security audits and penetration testing

### Environment & Configuration
- Never hardcode secrets in code
- Use environment variables for sensitive config
- Implement secret rotation mechanism
- Use different credentials for dev/staging/production

---

## Performance & Scalability

### Database Optimization
- Implement proper indexing on frequently queried columns
- Use pagination for list endpoints
- Implement caching for frequently accessed data (Redis)
- Optimize complex queries with query builders
- Archive old invoices after 2-3 years

### API Performance
- Implement request/response caching
- Use CDN for static assets
- Compress responses (gzip)
- Implement pagination limits
- Use database connection pooling

### Monitoring & Metrics
- Track API response times (p50, p95, p99)
- Monitor error rates and types
- Track database query performance
- Monitor server resource usage (CPU, memory)
- Set up alerts for anomalies

### Scalability Strategy
- Design stateless API for horizontal scaling
- Use load balancer for traffic distribution
- Implement message queue for async operations (email sending, PDF generation)
- Use caching layer (Redis) for frequently accessed data
- Consider read replicas for database scaling

---

## Deployment & DevOps

### Development Environment
```bash
# Clone repository
git clone https://github.com/yourorg/gst-billing-backend.git

# Install dependencies
npm install

# Configure environment
cp .env.example .env.development
# Edit .env.development with local settings

# Setup database
npx typeorm migration:run

# Start development server
npm run start:dev
```

### Production Deployment

**Using Docker:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
```

**Using Docker Compose:**
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgres://user:password@postgres:5432/gst_billing
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=gst_billing
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

**Deployment Checklist:**
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] CORS configured for production domain
- [ ] Rate limiting enabled
- [ ] Logging and monitoring setup
- [ ] Backup strategy configured
- [ ] CDN setup for static files
- [ ] Security headers configured
- [ ] Database backups automated

### Environment Variables

```bash
# Server
NODE_ENV=production
PORT=3001
APP_URL=https://api.yourdomain.com

# Database
DATABASE_URL=postgres://user:password@host:5432/gst_billing
DATABASE_POOL_SIZE=10

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRATION=3600
REFRESH_TOKEN_EXPIRATION=604800

# Frontend
FRONTEND_URL=https://yourdomain.com
CORS_ORIGIN=https://yourdomain.com

# Email (if using external service)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@yourdomain.com

# AWS S3 (for file uploads)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=your-bucket-name

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# Monitoring
SENTRY_DSN=your-sentry-dsn
```

---

## Testing Strategy

### Unit Testing
```bash
npm run test
```

### E2E Testing
```bash
npm run test:e2e
```

### Load Testing
```bash
# Using Artillery
npm run test:load

# Using Apache Bench
ab -n 1000 -c 10 http://localhost:3001/api/health
```

---

## Development Workflow

### Code Structure
```
src/
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
├── config/
├── database/
│   ├── entities/
│   ├── migrations/
│   └── repositories/
├── modules/
│   ├── auth/
│   ├── customers/
│   ├── products/
│   ├── invoices/
│   └── settings/
├── services/
└── main.ts
```

### Commit Convention
```
feat: Add new feature
fix: Fix bug
refactor: Refactor code
docs: Update documentation
test: Add tests
chore: Update dependencies
```

---

## Support & Maintenance

### Regular Maintenance Tasks
- Monitor database performance and optimize indexes
- Review and update dependencies monthly
- Conduct security audits quarterly
- Analyze API logs and metrics for improvements
- Update GST rates as per government announcements

### Common Issues & Solutions

**High API Latency:**
- Check database query performance
- Verify database connection pool settings
- Enable caching for frequently accessed data
- Review logs for slow queries

**Memory Leaks:**
- Use memory profiler to identify leaks
- Check for unclosed database connections
- Review event listeners for cleanup

---

## Conclusion

This backend specification provides a comprehensive guide for building a production-grade GST billing SaaS backend. The architecture is scalable, secure, and follows industry best practices. Implementation should follow the NestJS documentation and TypeScript best practices.

For questions or updates to this specification, refer to the project repository or contact the development team.
