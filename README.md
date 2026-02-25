# 📋 Attendance System

A Node.js + Express backend application for managing attendance, powered by **PostgreSQL** as the database.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [PostgreSQL Guide](#postgresql-guide)
  - [What is PostgreSQL?](#what-is-postgresql)
  - [Installation](#installation)
  - [Starting & Stopping PostgreSQL](#starting--stopping-postgresql)
  - [Accessing PostgreSQL](#accessing-postgresql)
  - [Database & User Setup](#database--user-setup)
  - [Environment Variables](#environment-variables)
  - [Common SQL Commands](#common-sql-commands)
  - [Data Types](#data-types)
  - [Table Operations](#table-operations)
  - [CRUD Operations](#crud-operations)
  - [Relationships & Joins](#relationships--joins)
  - [Indexing & Performance](#indexing--performance)
  - [Backup & Restore](#backup--restore)
  - [Using PostgreSQL with Node.js (pg)](#using-postgresql-with-nodejs-pg)
  - [Best Practices](#best-practices)
  - [Troubleshooting](#troubleshooting)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [License](#license)

---

## Tech Stack

| Technology   | Purpose             |
| ------------ | ------------------- |
| Node.js      | Runtime             |
| Express v5   | Web framework       |
| PostgreSQL   | Relational database |
| pg (node-pg) | PostgreSQL client   |
| dotenv       | Environment config  |
| bcrypt       | Password hashing    |
| nodemon      | Development server  |

---

## Getting Started

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd Attendenc

# 2. Install dependencies
npm install

# 3. Create a .env file (see Environment Variables section below)

# 4. Start the development server
npm run dev
```

---

## PostgreSQL Guide

### What is PostgreSQL?

**PostgreSQL** (often called **Postgres**) is a powerful, open-source **object-relational database system** (ORDBMS). It has been actively developed for over 35 years and is known for:

- ✅ **ACID compliance** — Ensures reliable transactions
- ✅ **Extensibility** — Supports custom data types, functions, and extensions
- ✅ **Standards compliance** — Closely follows the SQL standard
- ✅ **Concurrency** — Uses MVCC (Multi-Version Concurrency Control) for high performance
- ✅ **JSON support** — Can work with both relational and document-based data
- ✅ **Scalability** — Handles everything from small apps to enterprise-level systems

---

### Installation

#### macOS (Homebrew)

```bash
# Install PostgreSQL
brew install postgresql@16

# Start PostgreSQL service
brew services start postgresql@16

# Verify installation
psql --version
```

#### Ubuntu / Debian

```bash
# Update packages
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Verify installation
psql --version
```

#### Windows

1. Download the installer from [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the setup wizard
3. Set a password for the `postgres` superuser during installation
4. The installer includes **pgAdmin** (a GUI tool) and **psql** (CLI tool)

#### Using Docker

```bash
# Pull and run PostgreSQL in a container
docker run --name my-postgres \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=attendance_db \
  -p 5432:5432 \
  -d postgres:16
```

---

### Starting & Stopping PostgreSQL

#### macOS (Homebrew)

```bash
# Start
brew services start postgresql@16

# Stop
brew services stop postgresql@16

# Restart
brew services restart postgresql@16

# Check status
brew services list
```

#### Ubuntu / Debian

```bash
# Start
sudo systemctl start postgresql

# Stop
sudo systemctl stop postgresql

# Restart
sudo systemctl restart postgresql

# Check status
sudo systemctl status postgresql
```

---

### Accessing PostgreSQL

#### Using `psql` (Command-Line Interface)

```bash
# Connect as the default 'postgres' superuser
psql -U postgres

# Connect to a specific database
psql -U myuser -d attendance_db

# Connect to a remote database
psql -h hostname -p 5432 -U myuser -d attendance_db
```

#### Useful `psql` Meta-Commands

| Command           | Description                         |
| ----------------- | ----------------------------------- |
| `\l`              | List all databases                  |
| `\c dbname`       | Connect to a database               |
| `\dt`             | List all tables in current database |
| `\d tablename`    | Describe a table (columns, types)   |
| `\du`             | List all users/roles                |
| `\di`             | List all indexes                    |
| `\df`             | List all functions                  |
| `\x`              | Toggle expanded display mode        |
| `\timing`         | Toggle query execution time display |
| `\q`              | Quit psql                           |
| `\i filename.sql` | Execute commands from a SQL file    |
| `\conninfo`       | Display current connection info     |

---

### Database & User Setup

Here's how to set up the database and user for this Attendance System project:

```sql
-- 1. Connect as superuser
-- psql -U postgres

-- 2. Create a new user
CREATE USER attendance_user WITH PASSWORD 'your_secure_password';

-- 3. Create the database
CREATE DATABASE attendance_db OWNER attendance_user;

-- 4. Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE attendance_db TO attendance_user;

-- 5. Connect to the new database
\c attendance_db

-- 6. Grant schema privileges (PostgreSQL 15+)
GRANT ALL ON SCHEMA public TO attendance_user;
```

---

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
PORT=3000
DB_HOSTNAME=localhost
DB_PORT=5432
DB_USER=attendance_user
DB_PASSWORD=your_secure_password
DB_DATABASE_NAME=attendance_db
```

These variables are used by the `config/db.js` file to establish the database connection using the `pg` Pool.

---

### Common SQL Commands

#### Database Management

```sql
-- Create a database
CREATE DATABASE my_database;

-- Drop (delete) a database
DROP DATABASE my_database;

-- Rename a database
ALTER DATABASE old_name RENAME TO new_name;
```

#### User / Role Management

```sql
-- Create a user with password
CREATE USER myuser WITH PASSWORD 'mypassword';

-- Grant superuser privilege
ALTER USER myuser WITH SUPERUSER;

-- Change user password
ALTER USER myuser WITH PASSWORD 'new_password';

-- Drop a user
DROP USER myuser;
```

---

### Data Types

PostgreSQL has a rich set of data types:

| Category      | Type                        | Description                             |
| ------------- | --------------------------- | --------------------------------------- |
| **Numeric**   | `INTEGER` / `INT`           | 4-byte integer                          |
|               | `BIGINT`                    | 8-byte integer                          |
|               | `SMALLINT`                  | 2-byte integer                          |
|               | `SERIAL`                    | Auto-incrementing 4-byte integer        |
|               | `BIGSERIAL`                 | Auto-incrementing 8-byte integer        |
|               | `DECIMAL(p,s)` / `NUMERIC`  | Exact decimal number                    |
|               | `REAL`                      | 4-byte floating point                   |
|               | `DOUBLE PRECISION`          | 8-byte floating point                   |
| **Text**      | `VARCHAR(n)`                | Variable-length string (max n chars)    |
|               | `CHAR(n)`                   | Fixed-length string                     |
|               | `TEXT`                      | Unlimited-length string                 |
| **Boolean**   | `BOOLEAN`                   | `TRUE`, `FALSE`, or `NULL`              |
| **Date/Time** | `DATE`                      | Date only (YYYY-MM-DD)                  |
|               | `TIME`                      | Time only (HH:MM:SS)                    |
|               | `TIMESTAMP`                 | Date + Time                             |
|               | `TIMESTAMPTZ`               | Date + Time with timezone               |
|               | `INTERVAL`                  | Time duration                           |
| **JSON**      | `JSON`                      | JSON text data                          |
|               | `JSONB`                     | Binary JSON (faster queries, indexable) |
| **UUID**      | `UUID`                      | Universally unique identifier           |
| **Array**     | `INTEGER[]`, `TEXT[]`, etc. | Array of any data type                  |
| **Network**   | `INET`                      | IPv4 or IPv6 address                    |
|               | `CIDR`                      | Network address                         |

---

### Table Operations

#### Creating Tables

```sql
-- Example: Users table for the Attendance System
CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(255) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(20) DEFAULT 'student',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example: Attendance table
CREATE TABLE attendance (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date        DATE NOT NULL DEFAULT CURRENT_DATE,
    status      VARCHAR(10) NOT NULL CHECK (status IN ('present', 'absent', 'late')),
    check_in    TIME,
    check_out   TIME,
    remarks     TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date)
);
```

#### Altering Tables

```sql
-- Add a column
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- Drop a column
ALTER TABLE users DROP COLUMN phone;

-- Rename a column
ALTER TABLE users RENAME COLUMN name TO full_name;

-- Change column data type
ALTER TABLE users ALTER COLUMN role TYPE VARCHAR(50);

-- Add a constraint
ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);

-- Set a default value
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'student';

-- Drop a table
DROP TABLE IF EXISTS attendance;
```

---

### CRUD Operations

#### CREATE (Insert)

```sql
-- Insert a single row
INSERT INTO users (name, email, password, role)
VALUES ('John Doe', 'john@example.com', '$2b$10$hashedpassword', 'student');

-- Insert multiple rows
INSERT INTO users (name, email, password, role)
VALUES
    ('Jane Smith', 'jane@example.com', '$2b$10$hashedpassword', 'student'),
    ('Admin User', 'admin@example.com', '$2b$10$hashedpassword', 'admin');

-- Insert and return the created row
INSERT INTO users (name, email, password)
VALUES ('Alice', 'alice@example.com', '$2b$10$hashedpassword')
RETURNING *;
```

#### READ (Select)

```sql
-- Select all rows
SELECT * FROM users;

-- Select specific columns
SELECT id, name, email FROM users;

-- Filter with WHERE
SELECT * FROM users WHERE role = 'student';

-- Pattern matching with LIKE
SELECT * FROM users WHERE name LIKE 'J%';    -- starts with 'J'
SELECT * FROM users WHERE email ILIKE '%example%'; -- case-insensitive

-- Sorting
SELECT * FROM users ORDER BY created_at DESC;

-- Pagination with LIMIT and OFFSET
SELECT * FROM users ORDER BY id LIMIT 10 OFFSET 0;  -- page 1
SELECT * FROM users ORDER BY id LIMIT 10 OFFSET 10; -- page 2

-- Aggregate functions
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM attendance WHERE status = 'present' AND date = CURRENT_DATE;

-- Group by
SELECT status, COUNT(*) as count
FROM attendance
WHERE date = CURRENT_DATE
GROUP BY status;
```

#### UPDATE

```sql
-- Update a single row
UPDATE users SET role = 'admin' WHERE id = 1;

-- Update multiple columns
UPDATE users
SET name = 'John Updated', email = 'john.updated@example.com'
WHERE id = 1
RETURNING *;

-- Update with conditions
UPDATE attendance
SET status = 'late', remarks = 'Arrived after 9 AM'
WHERE user_id = 1 AND date = CURRENT_DATE;
```

#### DELETE

```sql
-- Delete a specific row
DELETE FROM users WHERE id = 5;

-- Delete with conditions
DELETE FROM attendance WHERE date < '2025-01-01';

-- Delete and return deleted rows
DELETE FROM users WHERE role = 'student' RETURNING *;

-- Delete all rows (use with caution!)
DELETE FROM users;

-- Faster way to delete all rows (resets identity):
TRUNCATE TABLE attendance RESTART IDENTITY CASCADE;
```

---

### Relationships & Joins

#### Types of Relationships

```sql
-- One-to-Many: One user has many attendance records
CREATE TABLE attendance (
    id        SERIAL PRIMARY KEY,
    user_id   INTEGER REFERENCES users(id) ON DELETE CASCADE
    -- ...
);

-- Many-to-Many: Students enrolled in multiple courses
CREATE TABLE courses (
    id    SERIAL PRIMARY KEY,
    name  VARCHAR(100) NOT NULL
);

CREATE TABLE enrollments (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
    course_id  INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE(user_id, course_id)
);
```

#### JOIN Queries

```sql
-- INNER JOIN: Get attendance with user details
SELECT u.name, u.email, a.date, a.status
FROM attendance a
INNER JOIN users u ON a.user_id = u.id
WHERE a.date = CURRENT_DATE;

-- LEFT JOIN: Get all users with their attendance (even if no record exists)
SELECT u.name, a.date, a.status
FROM users u
LEFT JOIN attendance a ON u.id = a.user_id AND a.date = CURRENT_DATE;

-- Multiple JOINs
SELECT u.name, c.name AS course_name, a.date, a.status
FROM users u
JOIN enrollments e ON u.id = e.user_id
JOIN courses c ON e.course_id = c.id
LEFT JOIN attendance a ON u.id = a.user_id AND a.date = CURRENT_DATE;
```

---

### Indexing & Performance

```sql
-- Create an index (speeds up WHERE queries)
CREATE INDEX idx_attendance_user_id ON attendance(user_id);
CREATE INDEX idx_attendance_date ON attendance(date);

-- Create a composite index
CREATE INDEX idx_attendance_user_date ON attendance(user_id, date);

-- Create a unique index
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- Partial index (only indexes rows matching a condition)
CREATE INDEX idx_active_students ON users(id) WHERE role = 'student';

-- View existing indexes
SELECT * FROM pg_indexes WHERE tablename = 'attendance';

-- Drop an index
DROP INDEX idx_attendance_date;

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM attendance WHERE user_id = 1;
```

---

### Backup & Restore

#### Backup

```bash
# Backup a single database to a SQL file
pg_dump -U attendance_user -d attendance_db > backup.sql

# Backup in custom format (compressed, more flexible)
pg_dump -U attendance_user -d attendance_db -Fc > backup.dump

# Backup specific table(s)
pg_dump -U attendance_user -d attendance_db -t users -t attendance > tables_backup.sql

# Backup all databases
pg_dumpall -U postgres > all_databases.sql
```

#### Restore

```bash
# Restore from SQL file
psql -U attendance_user -d attendance_db < backup.sql

# Restore from custom format
pg_restore -U attendance_user -d attendance_db backup.dump

# Restore with clean (drop existing objects first)
pg_restore -U attendance_user -d attendance_db --clean backup.dump
```

---

### Using PostgreSQL with Node.js (pg)

This project uses the **[node-postgres (pg)](https://node-postgres.com/)** library. Here's a detailed guide:

#### Connection Pool (as used in this project)

```js
// config/db.js
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOSTNAME,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE_NAME,
});

export const connectDB = async () => {
  try {
    await pool.connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Database connection failed", error);
  }
};
```

#### Running Queries

```js
// Simple query
const result = await pool.query("SELECT * FROM users");
console.log(result.rows); // Array of user objects

// Parameterized query (PREVENTS SQL INJECTION!)
const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
  "john@example.com",
]);

// Insert with returning
const newUser = await pool.query(
  "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
  ["John Doe", "john@example.com", hashedPassword],
);
console.log(newUser.rows[0]); // The created user

// Update
const updated = await pool.query(
  "UPDATE users SET name = $1 WHERE id = $2 RETURNING *",
  ["Updated Name", userId],
);

// Delete
const deleted = await pool.query(
  "DELETE FROM users WHERE id = $1 RETURNING *",
  [userId],
);
```

#### Transactions

```js
const client = await pool.connect();

try {
  await client.query("BEGIN");

  // Multiple queries in one transaction
  const user = await client.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id",
    ["John", "john@example.com", hashedPassword],
  );

  await client.query(
    "INSERT INTO attendance (user_id, date, status) VALUES ($1, CURRENT_DATE, $2)",
    [user.rows[0].id, "present"],
  );

  await client.query("COMMIT");
  console.log("Transaction completed successfully");
} catch (error) {
  await client.query("ROLLBACK");
  console.error("Transaction failed, rolled back", error);
} finally {
  client.release(); // Always release the client back to the pool
}
```

#### Error Handling

```js
try {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [
    userId,
  ]);

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(result.rows[0]);
} catch (error) {
  // Handle specific PostgreSQL error codes
  if (error.code === "23505") {
    // Unique violation
    return res.status(409).json({ message: "Email already exists" });
  }
  if (error.code === "23503") {
    // Foreign key violation
    return res
      .status(400)
      .json({ message: "Referenced record does not exist" });
  }
  console.error("Database error:", error);
  res.status(500).json({ message: "Internal server error" });
}
```

#### Common PostgreSQL Error Codes

| Code    | Name                        | Description                                    |
| ------- | --------------------------- | ---------------------------------------------- |
| `23505` | unique_violation            | Duplicate key value violates unique constraint |
| `23503` | foreign_key_violation       | Insert/update violates foreign key constraint  |
| `23502` | not_null_violation          | Null value in column that doesn't allow nulls  |
| `23514` | check_violation             | Value violates a CHECK constraint              |
| `42P01` | undefined_table             | Table does not exist                           |
| `42703` | undefined_column            | Column does not exist                          |
| `28P01` | invalid_password            | Wrong password for authentication              |
| `3D000` | invalid_catalog_name        | Database does not exist                        |
| `08001` | sqlclient_unable_to_connect | Could not connect to database                  |
| `57P03` | cannot_connect_now          | Database is starting up                        |

---

### Best Practices

1. **Always use parameterized queries** — Never concatenate user input into SQL strings. Use `$1`, `$2`, etc.

   ```js
   // ✅ GOOD — Safe from SQL injection
   pool.query("SELECT * FROM users WHERE id = $1", [userId]);

   // ❌ BAD — Vulnerable to SQL injection
   pool.query(`SELECT * FROM users WHERE id = ${userId}`);
   ```

2. **Use connection pooling** — This project uses `Pool` from `pg`, which is correct. Avoid creating a new connection for every query.

3. **Always release clients** — When using `pool.connect()` for transactions, always call `client.release()` in a `finally` block.

4. **Use transactions for multiple related writes** — Wrap related INSERT/UPDATE/DELETE operations in `BEGIN` / `COMMIT` / `ROLLBACK`.

5. **Add proper indexes** — Index columns frequently used in WHERE, JOIN, and ORDER BY clauses.

6. **Use `RETURNING *`** — After INSERT or UPDATE, use `RETURNING` to get the affected row without a separate SELECT.

7. **Use `TIMESTAMPTZ` over `TIMESTAMP`** — Always store timestamps with timezone to avoid confusing bugs.

8. **Use `TEXT` over `VARCHAR` when length is unknown** — PostgreSQL handles `TEXT` and `VARCHAR` equally; `TEXT` is simpler when you don't need a length constraint.

9. **Set `ON DELETE CASCADE` carefully** — Automatically deletes child records when parent is deleted. Useful for attendance records tied to users, but be cautious with important data.

10. **Regular backups** — Schedule automated backups with `pg_dump` or use a managed service with built-in backups.

---

### Troubleshooting

#### ❌ "FATAL: password authentication failed"

```bash
# Check your .env file for correct credentials
# Ensure the user exists:
psql -U postgres -c "\du"
```

#### ❌ "FATAL: database does not exist"

```bash
# Create the database:
psql -U postgres -c "CREATE DATABASE attendance_db;"
```

#### ❌ "Connection refused" or "Could not connect"

```bash
# Make sure PostgreSQL is running:
brew services list          # macOS
sudo systemctl status postgresql  # Linux

# Check if it's listening on the right port:
lsof -i :5432              # macOS/Linux
```

#### ❌ "FATAL: role 'username' does not exist"

```bash
# Create the role:
psql -U postgres -c "CREATE USER attendance_user WITH PASSWORD 'your_password';"
```

#### ❌ "Permission denied for schema public"

```bash
# Grant permissions (PostgreSQL 15+):
psql -U postgres -d attendance_db -c "GRANT ALL ON SCHEMA public TO attendance_user;"
```

#### ❌ "Relation (table) does not exist"

```bash
# Check you're connected to the right database:
psql -U attendance_user -d attendance_db -c "\dt"

# Run your migration or table creation SQL
```

---

## Project Structure

```
Attendenc/
├── config/
│   └── db.js              # PostgreSQL connection pool & config
├── src/
│   ├── middleware/         # Express middleware
│   └── modules/
│       └── users/          # Users module (routes, controllers, etc.)
├── .env                    # Environment variables (not committed to git)
├── index.js                # Application entry point
├── package.json            # Dependencies & scripts
└── README.md               # This file
```

---

## Scripts

```bash
# Start the production server
npm start

# Start the development server (with hot-reload via nodemon)
npm run dev
```

---

## License

ISC
