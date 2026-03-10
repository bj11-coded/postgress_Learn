# 🔷 ORM (Prisma) — Complete Guide with PostgreSQL & Node.js

> A comprehensive guide to using **Prisma ORM** with **PostgreSQL** in a **Node.js** application — from zero to production.

---

## Table of Contents

1. [What is an ORM?](#1-what-is-an-orm)
2. [What is Prisma?](#2-what-is-prisma)
3. [Prisma vs Raw SQL (pg) vs Other ORMs](#3-prisma-vs-raw-sql-pg-vs-other-orms)
4. [Setup & Installation](#4-setup--installation)
5. [Prisma Schema Deep Dive](#5-prisma-schema-deep-dive)
6. [Migrations](#6-migrations)
7. [CRUD Operations with Prisma Client](#7-crud-operations-with-prisma-client)
8. [Relations & Nested Queries](#8-relations--nested-queries)
9. [Advanced Features](#9-advanced-features)
10. [Using Prisma in This Attendance Project](#10-using-prisma-in-this-attendance-project)
11. [Benefits of Prisma](#11-benefits-of-prisma)
12. [Limitations of Prisma](#12-limitations-of-prisma)
13. [Best Practices](#13-best-practices)
14. [Interview Questions & Answers](#14-interview-questions--answers)

---

## 1. What is an ORM?

**ORM** stands for **Object-Relational Mapping**. It is a technique that lets you interact with your database using your programming language's objects instead of writing raw SQL queries.

### Without ORM (Raw SQL with `pg`):

```js
const result = await pool.query("SELECT * FROM users WHERE email = $1", [
  "john@example.com",
]);
const user = result.rows[0];
```

### With ORM (Prisma):

```js
const user = await prisma.user.findUnique({
  where: { email: "john@example.com" },
});
```

### Key Concepts:

| Concept      | SQL Equivalent    | ORM Equivalent            |
| ------------ | ----------------- | ------------------------- |
| Table        | `CREATE TABLE`    | Model definition          |
| Row          | `INSERT INTO`     | `prisma.model.create()`   |
| Column       | Column definition | Field in model            |
| Query        | `SELECT * FROM`   | `prisma.model.findMany()` |
| Relationship | `FOREIGN KEY`     | `@relation` decorator     |

---

## 2. What is Prisma?

**Prisma** is a **next-generation ORM** for Node.js and TypeScript. It consists of three main tools:

| Tool               | Purpose                                     |
| ------------------ | ------------------------------------------- |
| **Prisma Client**  | Auto-generated, type-safe query builder     |
| **Prisma Migrate** | Declarative database migrations             |
| **Prisma Studio**  | GUI to view and edit your database visually |

### Why Prisma Stands Out:

- 🔒 **Type-safe** — Auto-generated types from your schema (great with TypeScript)
- 📝 **Declarative schema** — Single source of truth (`schema.prisma`)
- ⚡ **Auto-generated client** — No boilerplate
- 🔄 **Migrations** — Version-controlled database changes
- 🖥️ **Prisma Studio** — Visual database browser
- 🗃️ **Multi-database support** — PostgreSQL, MySQL, SQLite, MongoDB, SQL Server, CockroachDB

---

## 3. Prisma vs Raw SQL (pg) vs Other ORMs

| Feature           | Raw SQL (`pg`)     | Sequelize      | TypeORM      | **Prisma**               |
| ----------------- | ------------------ | -------------- | ------------ | ------------------------ |
| Type Safety       | ❌ None            | ⚠️ Partial     | ✅ Good      | ✅ **Excellent**         |
| Learning Curve    | Low                | Medium         | High         | **Low-Medium**           |
| Schema Definition | Manual SQL         | JS/TS Models   | Decorators   | **`.prisma` file**       |
| Migrations        | Manual             | Built-in       | Built-in     | **Built-in (best)**      |
| Performance       | ✅ Fastest         | ⚠️ Can be slow | ⚠️ Medium    | ✅ **Very Fast**         |
| Raw SQL Support   | ✅ Native          | ✅ Supported   | ✅ Supported | ✅ **Supported**         |
| Relations         | Manual JOINs       | Built-in       | Built-in     | **Built-in (intuitive)** |
| GUI Tool          | pgAdmin (separate) | ❌ None        | ❌ None      | ✅ **Prisma Studio**     |
| Community & Docs  | Large              | Large          | Large        | **Growing rapidly**      |

---

## 4. Setup & Installation

### Step 1: Install Prisma

```bash
# Install Prisma CLI as a dev dependency
npm install prisma --save-dev

# Install Prisma Client (runtime dependency)
npm install @prisma/client
```

### Step 2: Initialize Prisma

```bash
npx prisma init --datasource-provider postgresql
```
or 

```bash
npx prisma  init --db --output ../generated/prisma
```

This creates:

```
Attendenc/
├── prisma/
│   └── schema.prisma    # Your database schema file
└── .env                 # Updated with DATABASE_URL
```

### Step 3: Configure Database URL

Update your `.env` file:

```env
DATABASE_URL="postgresql://attendance_user:your_password@localhost:5432/attendance_db?schema=public"
```

**URL Format:**

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
```

### Step 4: Define Your Schema

Edit `prisma/schema.prisma` (see Section 5 for details).

### Step 5: Run Migrations

```bash
npx prisma migrate dev --name init
```

### Step 6: Generate Prisma Client

```bash
npx prisma generate
```

### Step 7: Use Prisma Client in Your Code

```js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
```

---

## 5. Prisma Schema Deep Dive

The `schema.prisma` file is the **single source of truth** for your database.

### Complete Schema for Attendance System:

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Enums ──────────────────────────────────────────

enum Role {
  STUDENT
  TEACHER
  ADMIN
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  LATE
}

// ─── Models ─────────────────────────────────────────

model User {
  id         Int          @id @default(autoincrement())
  name       String       @db.VarChar(100)
  email      String       @unique @db.VarChar(255)
  password   String       @db.VarChar(255)
  role       Role         @default(STUDENT)
  createdAt  DateTime     @default(now()) @map("created_at")
  updatedAt  DateTime     @updatedAt @map("updated_at")

  // Relations
  attendance Attendance[]
  enrollments Enrollment[]

  @@map("users") // Maps to "users" table in PostgreSQL
}

model Course {
  id          Int          @id @default(autoincrement())
  name        String       @db.VarChar(100)
  code        String       @unique @db.VarChar(20)
  description String?      @db.Text
  createdAt   DateTime     @default(now()) @map("created_at")

  // Relations
  enrollments Enrollment[]
  attendance  Attendance[]

  @@map("courses")
}

model Enrollment {
  id        Int      @id @default(autoincrement())
  userId    Int      @map("user_id")
  courseId   Int      @map("course_id")
  enrolledAt DateTime @default(now()) @map("enrolled_at")

  // Relations
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  course Course @relation(fields: [courseId], references: [id], onDelete: Cascade)

  @@unique([userId, courseId]) // A user can enroll in a course only once
  @@map("enrollments")
}

model Attendance {
  id        Int              @id @default(autoincrement())
  userId    Int              @map("user_id")
  courseId   Int              @map("course_id")
  date      DateTime         @default(now()) @db.Date
  status    AttendanceStatus
  checkIn   DateTime?        @map("check_in") @db.Time()
  checkOut  DateTime?        @map("check_out") @db.Time()
  remarks   String?          @db.Text
  createdAt DateTime         @default(now()) @map("created_at")

  // Relations
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  course Course @relation(fields: [courseId], references: [id], onDelete: Cascade)

  @@unique([userId, courseId, date])
  @@map("attendance")
}
```

### Schema Attribute Reference:

| Attribute                   | Purpose                                |
| --------------------------- | -------------------------------------- |
| `@id`                       | Primary key                            |
| `@default(autoincrement())` | Auto-increment integer                 |
| `@default(now())`           | Default to current timestamp           |
| `@default(uuid())`          | Default to generated UUID              |
| `@unique`                   | Unique constraint on a field           |
| `@updatedAt`                | Auto-updates timestamp on modification |
| `@map("column_name")`       | Maps field to a different column name  |
| `@@map("table_name")`       | Maps model to a different table name   |
| `@@unique([a, b])`          | Composite unique constraint            |
| `@@index([a, b])`           | Composite index                        |
| `@relation`                 | Defines relationships between models   |
| `@db.VarChar(100)`          | Native database type mapping           |
| `?` (e.g., `String?`)       | Optional / nullable field              |

---

## 6. Migrations

### Create & Apply a Migration

```bash
# Create migration + apply to database
npx prisma migrate dev --name add_courses_table

# Apply migrations in production
npx prisma migrate deploy
```

### Other Migration Commands

```bash
# Reset database (deletes all data!)
npx prisma migrate reset

# Check migration status
npx prisma migrate status

# Generate Prisma Client without migrating
npx prisma generate

# Push schema to database without creating migration file (prototyping only)
npx prisma db push

# Pull existing database schema into schema.prisma
npx prisma db pull

# Seed the database
npx prisma db seed

# Open Prisma Studio (GUI)
npx prisma studio
```

### Seeding

Create a seed file:

```js
// prisma/seed.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@school.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@school.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log({ admin });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
```

Add to `package.json`:

```json
"prisma": {
  "seed": "node prisma/seed.js"
}
```

---

## 7. CRUD Operations with Prisma Client

### Setup Prisma Client (Singleton Pattern)

```js
// lib/prisma.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"], // Enable logging
});

export default prisma;
```

### CREATE

```js
// Create a single record
const user = await prisma.user.create({
  data: {
    name: "John Doe",
    email: "john@example.com",
    password: hashedPassword,
    role: "STUDENT",
  },
});

// Create many records
const users = await prisma.user.createMany({
  data: [
    { name: "Alice", email: "alice@example.com", password: hash1 },
    { name: "Bob", email: "bob@example.com", password: hash2 },
  ],
  skipDuplicates: true,
});
```

### READ

```js
// Find unique record
const user = await prisma.user.findUnique({
  where: { email: "john@example.com" },
});

// Find first match
const student = await prisma.user.findFirst({
  where: { role: "STUDENT" },
});

// Find many with filters, sorting, pagination
const users = await prisma.user.findMany({
  where: {
    role: "STUDENT",
    name: { contains: "John", mode: "insensitive" },
  },
  orderBy: { createdAt: "desc" },
  skip: 0, // offset
  take: 10, // limit
  select: {
    // select specific fields
    id: true,
    name: true,
    email: true,
  },
});

// Count records
const count = await prisma.user.count({
  where: { role: "STUDENT" },
});

// Aggregate
const stats = await prisma.attendance.groupBy({
  by: ["status"],
  _count: { status: true },
  where: { date: new Date() },
});
```

### UPDATE

```js
// Update one record
const updated = await prisma.user.update({
  where: { id: 1 },
  data: { name: "John Updated" },
});

// Update many records
const result = await prisma.user.updateMany({
  where: { role: "STUDENT" },
  data: { role: "TEACHER" },
});

// Upsert (update if exists, create if not)
const user = await prisma.user.upsert({
  where: { email: "john@example.com" },
  update: { name: "John Updated" },
  create: { name: "John", email: "john@example.com", password: hash },
});
```

### DELETE

```js
// Delete one
const deleted = await prisma.user.delete({
  where: { id: 1 },
});

// Delete many
const result = await prisma.user.deleteMany({
  where: { role: "STUDENT" },
});

// Delete all
await prisma.user.deleteMany();
```

---

## 8. Relations & Nested Queries

### Include Related Data

```js
// Get user with their attendance records
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    attendance: true,
    enrollments: { include: { course: true } },
  },
});

// Nested select
const user = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    name: true,
    email: true,
    attendance: {
      where: { status: "PRESENT" },
      select: { date: true, status: true },
    },
  },
});
```

### Nested Create

```js
// Create user + attendance in one query
const user = await prisma.user.create({
  data: {
    name: "Jane",
    email: "jane@example.com",
    password: hashedPassword,
    attendance: {
      create: [
        { courseId: 1, status: "PRESENT", date: new Date() },
        { courseId: 2, status: "LATE", date: new Date() },
      ],
    },
  },
  include: { attendance: true },
});
```

---

## 9. Advanced Features

### Transactions

```js
// Interactive transaction
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({
    data: { name: "John", email: "j@test.com", password: hash },
  });

  await tx.attendance.create({
    data: { userId: user.id, courseId: 1, status: "PRESENT" },
  });

  return user;
});
```

### Raw SQL (Escape Hatch)

```js
// Raw query
const users = await prisma.$queryRaw`SELECT * FROM users WHERE role = ${role}`;

// Raw execute
await prisma.$executeRaw`UPDATE users SET role = 'ADMIN' WHERE id = ${id}`;
```

### Middleware (Hooks)

```js
// Log every query
prisma.$use(async (params, next) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();
  console.log(`${params.model}.${params.action} took ${after - before}ms`);
  return result;
});

// Soft delete middleware
prisma.$use(async (params, next) => {
  if (params.model === "User" && params.action === "delete") {
    params.action = "update";
    params.args.data = { deletedAt: new Date() };
  }
  return next(params);
});
```

---

## 10. Using Prisma in This Attendance Project

### Example: User Controller with Prisma

```js
// src/modules/users/users.controller.js
import prisma from "../../../lib/prisma.js";
import bcrypt from "bcrypt";

// Register a new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark attendance
export const markAttendance = async (req, res) => {
  try {
    const { userId, courseId, status } = req.body;

    const record = await prisma.attendance.upsert({
      where: {
        userId_courseId_date: { userId, courseId, date: new Date() },
      },
      update: { status },
      create: { userId, courseId, status, date: new Date() },
    });

    res.json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get attendance report
export const getAttendanceReport = async (req, res) => {
  const { courseId } = req.params;
  const report = await prisma.attendance.groupBy({
    by: ["status"],
    where: { courseId: parseInt(courseId) },
    _count: { status: true },
  });
  res.json({ success: true, data: report });
};
```

---

## 11. Benefits of Prisma

| #   | Benefit                  | Description                                        |
| --- | ------------------------ | -------------------------------------------------- |
| 1   | **Type Safety**          | Auto-generated types prevent runtime errors        |
| 2   | **Auto-completion**      | IDE shows available fields and methods             |
| 3   | **Declarative Schema**   | Single file defines your entire database structure |
| 4   | **Migration System**     | Version-controlled, reproducible database changes  |
| 5   | **Relation Handling**    | Intuitive nested reads/writes without manual JOINs |
| 6   | **Prisma Studio**        | Visual database browser — no pgAdmin needed        |
| 7   | **SQL Injection Safe**   | Parameterized queries under the hood               |
| 8   | **Database Agnostic**    | Switch databases with minimal schema changes       |
| 9   | **Performance**          | Optimized query engine written in Rust             |
| 10  | **Developer Experience** | Less boilerplate, faster development, fewer bugs   |

---

## 12. Limitations of Prisma

| Limitation                 | Details                                               |
| -------------------------- | ----------------------------------------------------- |
| Complex raw SQL            | Very complex queries may still need `$queryRaw`       |
| Stored procedures          | Limited support for database stored procedures        |
| Database-specific features | Some PostgreSQL-specific features need raw SQL        |
| Bundle size                | Prisma Client adds to deployment size                 |
| Schema-first only          | Must define schema in `.prisma` file (not code-first) |

---

## 13. Best Practices

1. **Use a singleton** for `PrismaClient` to avoid too many connections
2. **Always disconnect** in scripts: `await prisma.$disconnect()`
3. **Use `select`** to fetch only needed fields (reduces payload)
4. **Use transactions** for multi-step operations
5. **Name migrations meaningfully**: `--name add_phone_to_users`
6. **Never edit migration files** after they've been applied
7. **Use `@@index`** on frequently queried fields
8. **Handle Prisma error codes** (`P2002`, `P2025`, etc.) gracefully

---

## 14. Interview Questions & Answers

### Q1: What is Prisma and how is it different from traditional ORMs?

> **Answer:** Prisma is a next-generation ORM for Node.js/TypeScript that uses a **declarative schema file** (`schema.prisma`) instead of class-based models. Unlike Sequelize or TypeORM, Prisma auto-generates a **type-safe client** from the schema, offers built-in **migration tooling**, and has a **visual GUI (Prisma Studio)**. Its query engine is written in **Rust** for better performance.

---

### Q2: What are the three main components of Prisma?

> **Answer:**
>
> 1. **Prisma Client** — Auto-generated, type-safe database query builder
> 2. **Prisma Migrate** — Schema migration and version control system
> 3. **Prisma Studio** — Web-based GUI for viewing/editing database records

---

### Q3: What is the Prisma schema file and why is it important?

> **Answer:** The `schema.prisma` file is the **single source of truth** for your database structure. It defines the data source (which database), the generator (Prisma Client), and all models (tables), their fields, types, relations, and constraints. Prisma uses this file to generate the client and migrations.

---

### Q4: Explain `findUnique` vs `findFirst` vs `findMany`.

> **Answer:**
>
> - `findUnique` — Finds exactly **one** record by a unique field (`@id` or `@unique`). Returns `null` if not found.
> - `findFirst` — Finds the **first** record matching the filter. Can use non-unique fields.
> - `findMany` — Returns **all** records matching the filter as an array.

---

### Q5: How does Prisma prevent SQL injection?

> **Answer:** Prisma Client uses **parameterized queries** internally. All values passed through the Prisma API are automatically escaped. Even `$queryRaw` uses tagged template literals that parameterize values, preventing injection.

---

### Q6: What is the difference between `prisma migrate dev` and `prisma db push`?

> **Answer:**
>
> - `migrate dev` — Creates a **migration file**, applies it, and regenerates the client. Used in **development** for version-controlled schema changes.
> - `db push` — Pushes schema changes **directly** to the database without creating migration files. Used for **rapid prototyping** only.

---

### Q7: How do you handle relations in Prisma?

> **Answer:** Relations are defined using the `@relation` attribute. Prisma supports **one-to-one**, **one-to-many**, and **many-to-many** relations. You define the relation field, the foreign key field, and use `include` or nested `select` to fetch related data in queries.

---

### Q8: What is `upsert` in Prisma?

> **Answer:** `upsert` combines **update** and **insert**. It checks if a record matching the `where` condition exists. If yes, it **updates** it; if no, it **creates** a new record. This avoids the need for a separate "check then insert/update" logic.

---

### Q9: How do transactions work in Prisma?

> **Answer:** Prisma supports two types of transactions:
>
> 1. **Sequential transactions** — `prisma.$transaction([query1, query2])` runs queries in order.
> 2. **Interactive transactions** — `prisma.$transaction(async (tx) => { ... })` gives full control with rollback on error.
>    Both ensure atomicity — either all operations succeed or none do.

---

### Q10: What are common Prisma error codes?

> **Answer:**
>
> - `P2002` — Unique constraint violation (duplicate key)
> - `P2003` — Foreign key constraint violation
> - `P2025` — Record not found (for update/delete)
> - `P2000` — Value too long for the column
> - `P2021` — Table does not exist
> - `P2022` — Column does not exist
> - `P1001` — Cannot reach the database server

---

### Q11: What is Prisma Studio and when would you use it?

> **Answer:** Prisma Studio is a **web-based GUI** launched with `npx prisma studio`. It lets you browse, filter, add, edit, and delete database records visually. It's useful during development for **debugging data**, **quick edits**, and **verifying migrations** without writing SQL.

---

### Q12: Can Prisma handle raw SQL? When would you use it?

> **Answer:** Yes. Prisma provides `$queryRaw` for SELECT queries and `$executeRaw` for INSERT/UPDATE/DELETE. You'd use raw SQL for **complex queries** that Prisma's API can't express (e.g., window functions, CTEs, complex aggregations, or database-specific features).

---

### Q13: How would you optimize Prisma queries for performance?

> **Answer:**
>
> 1. Use `select` instead of returning all fields
> 2. Add `@@index()` to frequently queried columns in the schema
> 3. Use pagination (`skip` / `take`) for large datasets
> 4. Avoid N+1 queries by using `include` for relations
> 5. Use `createMany` instead of multiple `create` calls
> 6. Enable query logging to identify slow queries
> 7. Use interactive transactions to batch related operations

---

### Q14: How is Prisma different from Sequelize?

> **Answer:**
> | Aspect | Prisma | Sequelize |
> | --------------- | ----------------------------- | --------------------------- |
> | Schema | `.prisma` file (declarative) | JS/TS class models |
> | Type Safety | Excellent (auto-generated) | Partial (manual types) |
> | Migrations | `prisma migrate` (automatic) | Manual migration files |
> | GUI | Prisma Studio (built-in) | None built-in |
> | Query Engine | Rust-based (fast) | JavaScript-based |
> | Learning Curve | Lower | Higher |

---

### Q15: What is the Prisma Client and how is it generated?

> **Answer:** Prisma Client is an **auto-generated**, **type-safe** database client customized to your schema. It is generated by running `npx prisma generate`, which reads `schema.prisma` and creates a client in `node_modules/@prisma/client`. It must be **regenerated** every time the schema changes.

---

## Quick Reference — Prisma CLI Commands

```bash
npx prisma init                          # Initialize Prisma
npx prisma generate                      # Generate Prisma Client
npx prisma migrate dev --name <name>     # Create & apply migration
npx prisma migrate deploy                # Apply pending migrations (production)
npx prisma migrate reset                 # Reset database & re-apply migrations
npx prisma migrate status                # Check migration status
npx prisma db push                       # Push schema without migration file
npx prisma db pull                       # Pull existing DB schema into .prisma
npx prisma db seed                       # Run seed script
npx prisma studio                        # Open visual database editor
npx prisma format                        # Format schema.prisma file
npx prisma validate                      # Validate schema.prisma
```

---

_Created for the Attendance System project — February 2026_
