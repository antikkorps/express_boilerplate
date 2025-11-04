# Express Boilerplate - Architecture & Best Practices

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture Principles](#architecture-principles)
3. [Project Structure](#project-structure)
4. [Coding Standards](#coding-standards)
5. [DRY Concept Implementation](#dry-concept-implementation)
6. [Middleware Architecture](#middleware-architecture)
7. [Error Handling Strategy](#error-handling-strategy)
8. [Database & ORM Patterns](#database--orm-patterns)
9. [Authentication & Security](#authentication--security)
10. [API Design Guidelines](#api-design-guidelines)
11. [Testing Strategy](#testing-strategy)
12. [Deployment Guidelines](#deployment-guidelines)

---

## Project Overview

This is a production-ready Express.js boilerplate built with TypeScript, implementing modern web development best practices and a scalable architecture.

### Tech Stack
- **Runtime**: Node.js v20+
- **Framework**: Express.js v5.1.0
- **Language**: TypeScript v5.5.3
- **Database**: PostgreSQL
- **ORM**: Sequelize v6.37.7 with sequelize-typescript
- **Authentication**: Passport.js with session-based auth
- **Security**: Helmet, CORS, bcrypt
- **Validation**: express-validator

---

## Architecture Principles

### 1. Layered Architecture

The project follows a **multi-layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────┐
│         Routes Layer                │  ← API endpoints definition
├─────────────────────────────────────┤
│      Middlewares Layer              │  ← Validation, auth, error handling
├─────────────────────────────────────┤
│      Controllers Layer              │  ← HTTP request/response handling
├─────────────────────────────────────┤
│       Services Layer                │  ← Business logic
├─────────────────────────────────────┤
│        Models Layer                 │  ← Data access & ORM models
├─────────────────────────────────────┤
│       Database Layer                │  ← PostgreSQL
└─────────────────────────────────────┘
```

**Benefits:**
- **Separation of Concerns**: Each layer has a single responsibility
- **Testability**: Easy to unit test each layer independently
- **Maintainability**: Changes in one layer don't affect others
- **Scalability**: Easy to add new features without breaking existing code

### 2. Single Responsibility Principle (SRP)

Each module, class, or function should have **one reason to change**.

**Example:**
```typescript
// ❌ BAD: Controller doing too much
export const register = async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashedPassword });
  res.json({ user });
};

// ✅ GOOD: Separated concerns
// Service handles business logic
export const registerUser = async (email: string, password: string) => {
  const hashedPassword = await hashPassword(password);
  return await User.create({ email, password: hashedPassword });
};

// Controller handles HTTP
export const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await registerUser(email, password);
  res.status(201).json({ status: "success", data: { user } });
});
```

### 3. DRY Principle (Don't Repeat Yourself)

Avoid code duplication by extracting reusable logic into shared utilities, middlewares, and services.

---

## Project Structure

```
/home/user/express_boilerplate/
├── src/
│   ├── config/              # Configuration files
│   │   └── database.ts      # Sequelize initialization & connection
│   ├── controllers/         # HTTP request handlers
│   │   └── authController.ts
│   ├── services/            # Business logic layer
│   │   └── authService.ts
│   ├── models/              # ORM models & database schema
│   │   └── user.ts
│   ├── routes/              # API route definitions
│   │   └── authRoutes.ts
│   ├── middlewares/         # Express middlewares
│   │   ├── errorHandler.ts      # Global error handling
│   │   ├── validators.ts        # Request validation
│   │   └── authMiddlewares.ts   # Authentication middlewares
│   ├── utils/               # Utility functions
│   │   └── bcrypt.ts
│   ├── app.ts               # Express app setup
│   └── server.ts            # Server entry point
├── .env.example             # Environment variables template
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies & scripts
├── Dockerfile               # Container image definition
├── compose.yml              # Docker Compose orchestration
└── agents.md                # This file
```

### Directory Responsibilities

| Directory | Responsibility | Example |
|-----------|---------------|---------|
| `config/` | Application configuration (DB, env) | Database connection pool settings |
| `controllers/` | HTTP layer - handle requests/responses | Parse req.body, call service, send response |
| `services/` | Business logic - core application rules | User registration, password validation |
| `models/` | Data layer - define schema & queries | User model with columns & associations |
| `routes/` | API endpoints - map URLs to controllers | `POST /auth/register` → `register` controller |
| `middlewares/` | Request processing - validation, auth, errors | `isAuthenticated`, `validateRegister` |
| `utils/` | Reusable helpers - pure functions | Password hashing, date formatting |

---

## Coding Standards

### 1. Language & Comments

**All code and comments MUST be written in English.**

```typescript
// ✅ GOOD: English comments
/**
 * Authenticates a user with email and password
 * @param email - User's email address
 * @param password - Plain text password
 * @returns User object if authentication succeeds, null otherwise
 */
export const authenticateUser = async (email: string, password: string) => {
  // ...
};

// ❌ BAD: Non-English comments
/**
 * Authentifie un utilisateur avec email et mot de passe
 */
```

### 2. TypeScript Best Practices

#### Use Explicit Types
```typescript
// ✅ GOOD
export const findUserById = async (id: string): Promise<User | null> => {
  return await User.findByPk(id);
};

// ❌ BAD: Implicit any
export const findUserById = async (id) => {
  return await User.findByPk(id);
};
```

#### Interface vs Type
```typescript
// Use interfaces for object shapes
interface UserResponse {
  id: string;
  email: string;
  name: string;
}

// Use types for unions, intersections, primitives
type UserRole = "admin" | "user" | "guest";
type ApiResponse<T> = { status: "success"; data: T } | { status: "error"; message: string };
```

### 3. Naming Conventions

```typescript
// Classes & Interfaces: PascalCase
class User extends Model {}
interface UserResponse {}

// Functions & Variables: camelCase
const getUserById = () => {};
const isAuthenticated = () => {};

// Constants: UPPER_SNAKE_CASE
const MAX_LOGIN_ATTEMPTS = 5;
const SESSION_SECRET = process.env.SESSION_SECRET;

// Files: camelCase for modules, PascalCase for classes
// authService.ts, userController.ts
// User.ts (if it exports a class)

// Private properties: prefix with underscore
class UserService {
  private _cache: Map<string, User>;
}
```

### 4. Function Documentation

Use JSDoc for all exported functions:

```typescript
/**
 * Registers a new user in the system
 *
 * @param email - User's email address (must be unique)
 * @param password - Plain text password (will be hashed)
 * @param name - User's display name
 * @returns Newly created user object
 * @throws {AppError} If email already exists (409)
 *
 * @example
 * const user = await registerUser("john@example.com", "password123", "John Doe");
 */
export const registerUser = async (
  email: string,
  password: string,
  name: string
): Promise<User> => {
  // Implementation
};
```

### 5. Code Organization

**Order within files:**
1. Imports (third-party, then local)
2. Type definitions & interfaces
3. Constants
4. Main logic
5. Exports

```typescript
// 1. Imports
import { Request, Response, NextFunction } from "express";
import { registerUser } from "../services/authService";

// 2. Types
interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// 3. Constants
const PASSWORD_MIN_LENGTH = 8;

// 4. Main logic
export const register = asyncHandler(async (req: Request, res: Response) => {
  // ...
});

// 5. Default export (if applicable)
export default register;
```

---

## DRY Concept Implementation

### 1. Middleware Reusability

**Problem:** Repeating authentication checks in every controller

```typescript
// ❌ BAD: Repeated logic
export const getProfile = async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    throw new AppError("Not authenticated", 401);
  }
  // ... logic
};

export const updateProfile = async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    throw new AppError("Not authenticated", 401);
  }
  // ... logic
};
```

**Solution:** Extract to middleware

```typescript
// ✅ GOOD: Reusable middleware
// middlewares/authMiddlewares.ts
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    throw new AppError("Not authenticated", 401);
  }
  next();
};

// routes/userRoutes.ts
router.get("/profile", isAuthenticated, getProfile);
router.put("/profile", isAuthenticated, updateProfile);
```

### 2. Async Error Handling

**Problem:** Repeating try-catch in every async controller

```typescript
// ❌ BAD: Repeated error handling
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await registerUser(req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
};
```

**Solution:** `asyncHandler` wrapper

```typescript
// ✅ GOOD: DRY error handling
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await registerUser(req.body);
  res.json(user);
});
```

### 3. Response Formatting

**Problem:** Inconsistent response structures

```typescript
// ❌ BAD: Inconsistent responses
res.json({ user }); // Sometimes
res.json({ data: user }); // Other times
res.json({ success: true, user }); // Another way
```

**Solution:** Standard response utilities

```typescript
// ✅ GOOD: Consistent responses
// utils/response.ts
export const successResponse = <T>(data: T, message?: string) => ({
  status: "success",
  message,
  data,
});

export const errorResponse = (message: string, statusCode: number) => ({
  status: "error",
  message,
  statusCode,
});

// controllers/authController.ts
res.status(201).json(successResponse({ user }, "User registered successfully"));
```

### 4. Validation Reusability

**Problem:** Duplicated validation logic

```typescript
// ❌ BAD: Validation in multiple places
export const register = async (req: Request) => {
  if (!req.body.email || !isValidEmail(req.body.email)) {
    throw new Error("Invalid email");
  }
  // ...
};
```

**Solution:** Centralized validators

```typescript
// ✅ GOOD: Reusable validators
// middlewares/validators.ts
export const validateRegister = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8 }),
  body("name").trim().notEmpty(),
];

// routes/authRoutes.ts
router.post("/register", validateRegister, handleValidationErrors, register);
```

---

## Middleware Architecture

### Middleware Types

1. **Application-level**: Apply to all routes
2. **Router-level**: Apply to specific route groups
3. **Error-handling**: Special 4-param middleware

### Middleware Execution Order

```typescript
// app.ts
app.use(helmet());                    // 1. Security headers
app.use(cors());                       // 2. CORS handling
app.use(morgan("dev"));                // 3. Request logging
app.use(express.json());               // 4. Body parsing
app.use(session());                    // 5. Session handling
app.use(passport.initialize());        // 6. Auth initialization
app.use(passport.session());           // 7. Session deserialization

// Route-specific
app.use("/auth", authRoutes);          // 8. Route handlers

// Error handling (must be last)
app.use(notFound);                     // 9. 404 handler
app.use(errorHandler);                 // 10. Global error handler
```

### Custom Middleware Best Practices

```typescript
/**
 * Middleware template
 * - Always document purpose
 * - Type all parameters
 * - Call next() or send response
 * - Handle errors properly
 */
export const exampleMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Middleware logic here

    // Option 1: Continue to next middleware
    next();

    // Option 2: Send response and stop chain
    // res.status(200).json({ ... });
  } catch (error) {
    // Forward errors to error handler
    next(error);
  }
};
```

### Authentication Middlewares

See `src/middlewares/authMiddlewares.ts` for implementation:

- `isAuthenticated`: Protect routes requiring login
- `isNotAuthenticated`: Prevent logged-in users from accessing login/register
- `hasRole(roles)`: Check user permissions
- `optionalAuth`: Attach user if available but don't require auth

---

## Error Handling Strategy

### Custom Error Class

```typescript
// middlewares/errorHandler.ts
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

### Error Handler Middleware

```typescript
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Development: send full error
  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  } else {
    // Production: send minimal info
    res.status(err.statusCode).json({
      status: err.status,
      message: err.isOperational ? err.message : "Something went wrong",
    });
  }
};
```

### Error Usage

```typescript
// Throw operational errors
if (!user) {
  throw new AppError("User not found", 404);
}

// Database errors are caught and converted
try {
  await user.save();
} catch (error: any) {
  if (error.name === "SequelizeUniqueConstraintError") {
    throw new AppError("Email already exists", 409);
  }
  throw error; // Pass to global handler
}
```

---

## Database & ORM Patterns

### Model Definition

Use **sequelize-typescript** decorators for clean, type-safe models:

```typescript
// models/user.ts
import { Table, Column, Model, PrimaryKey, Default, DataType } from "sequelize-typescript";

@Table({ tableName: "users", timestamps: true })
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password!: string;

  @Column({ type: DataType.STRING })
  name!: string;

  // Timestamps are automatically added: createdAt, updatedAt
}
```

### Database Configuration

```typescript
// config/database.ts
import { Sequelize } from "sequelize-typescript";
import { User } from "../models/user";

export const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || "mydb",
  username: process.env.DB_USER || "user",
  password: process.env.DB_PASSWORD || "password",
  models: [User], // Register all models here
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});
```

### Query Best Practices

```typescript
// ✅ GOOD: Use model methods
const user = await User.findOne({ where: { email } });
const users = await User.findAll({ where: { isActive: true } });

// ✅ GOOD: Use transactions for multiple operations
await sequelize.transaction(async (t) => {
  const user = await User.create({ email, password }, { transaction: t });
  await Profile.create({ userId: user.id }, { transaction: t });
});

// ✅ GOOD: Select specific attributes
const users = await User.findAll({
  attributes: ["id", "email", "name"], // Exclude password
  where: { isActive: true },
});

// ❌ BAD: Raw queries without reason
await sequelize.query("SELECT * FROM users WHERE email = ?", [email]);
```

---

## Authentication & Security

### Password Security

```typescript
// utils/bcrypt.ts
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePasswords = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
```

### Session Configuration

```typescript
// app.ts
app.use(
  session({
    secret: process.env.SESSION_SECRET as string, // Use strong secret
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      httpOnly: true, // Prevent XSS
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: "strict", // CSRF protection
    },
  })
);
```

### Passport Configuration

```typescript
// app.ts
passport.serializeUser((user, done) => {
  done(null, (user as any).id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await findUserById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
```

### Security Headers

```typescript
// app.ts
app.use(helmet()); // Sets secure HTTP headers
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true, // Allow cookies
}));
```

---

## API Design Guidelines

### RESTful Endpoints

```
Resource: Users
GET    /users          - List all users
GET    /users/:id      - Get single user
POST   /users          - Create new user
PUT    /users/:id      - Update entire user
PATCH  /users/:id      - Partial update user
DELETE /users/:id      - Delete user
```

### Response Format

**Success Response:**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Email already exists",
  "statusCode": 409
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Not authenticated |
| 403 | Forbidden | Authenticated but no permission |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource (e.g., email exists) |
| 500 | Internal Server Error | Unexpected server error |

### Versioning

```typescript
// Option 1: URL versioning (recommended)
app.use("/api/v1/users", userRoutesV1);
app.use("/api/v2/users", userRoutesV2);

// Option 2: Header versioning
app.use((req, res, next) => {
  const version = req.headers["api-version"];
  // Route based on version
});
```

---

## Testing Strategy

### Test Structure

```
tests/
├── unit/              # Unit tests (services, utils)
├── integration/       # Integration tests (API endpoints)
└── e2e/               # End-to-end tests
```

### Unit Test Example

```typescript
// tests/unit/authService.test.ts
import { registerUser, authenticateUser } from "../../src/services/authService";
import { User } from "../../src/models/user";

describe("AuthService", () => {
  describe("registerUser", () => {
    it("should create a new user with hashed password", async () => {
      const user = await registerUser("test@example.com", "password123", "Test User");
      expect(user.email).toBe("test@example.com");
      expect(user.password).not.toBe("password123"); // Should be hashed
    });

    it("should throw error for duplicate email", async () => {
      await registerUser("test@example.com", "password123", "Test User");
      await expect(
        registerUser("test@example.com", "password456", "Another User")
      ).rejects.toThrow("Email already exists");
    });
  });
});
```

### Integration Test Example

```typescript
// tests/integration/auth.test.ts
import request from "supertest";
import app from "../../src/app";

describe("POST /auth/register", () => {
  it("should register a new user", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({
        email: "newuser@example.com",
        password: "securePassword123",
        name: "New User",
      })
      .expect(201);

    expect(response.body.status).toBe("success");
    expect(response.body.data.user).toHaveProperty("id");
  });

  it("should return 400 for invalid email", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({
        email: "invalid-email",
        password: "password123",
        name: "User",
      })
      .expect(400);

    expect(response.body.status).toBe("error");
  });
});
```

---

## Deployment Guidelines

### Environment Variables

**Required variables:**
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mydb
DB_USER=user
DB_PASSWORD=password

# Server
PORT=3000
NODE_ENV=production

# Security
SESSION_SECRET=your-super-secret-key-change-this
CORS_ORIGIN=https://yourdomain.com
```

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `SESSION_SECRET` (32+ random characters)
- [ ] Enable HTTPS (`cookie.secure = true`)
- [ ] Configure proper CORS origins
- [ ] Set up database connection pooling
- [ ] Disable verbose logging
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Configure rate limiting
- [ ] Set up health checks
- [ ] Use process manager (PM2, systemd)
- [ ] Set up database backups
- [ ] Configure log rotation

### Docker Deployment

```bash
# Build image
docker build -t express-boilerplate .

# Run with Docker Compose
docker compose up -d

# View logs
docker compose logs -f app

# Stop services
docker compose down
```

### Health Checks

```typescript
// app.ts
app.get("/health", async (req, res) => {
  try {
    // Check database connection
    await sequelize.authenticate();

    res.status(200).json({
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: "connected",
    });
  } catch (error) {
    res.status(503).json({
      status: "ERROR",
      timestamp: new Date().toISOString(),
      database: "disconnected",
    });
  }
});
```

---

## Adding New Features

### Step-by-Step Guide

**Example: Adding a "Post" resource**

1. **Create Model** (`src/models/post.ts`)
```typescript
@Table({ tableName: "posts", timestamps: true })
export class Post extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  title!: string;

  @Column({ type: DataType.TEXT })
  content!: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId!: string;

  @BelongsTo(() => User)
  author!: User;
}
```

2. **Create Service** (`src/services/postService.ts`)
```typescript
export const createPost = async (
  title: string,
  content: string,
  userId: string
): Promise<Post> => {
  return await Post.create({ title, content, userId });
};

export const getPostById = async (id: string): Promise<Post | null> => {
  return await Post.findByPk(id, { include: [User] });
};
```

3. **Create Controller** (`src/controllers/postController.ts`)
```typescript
export const createPost = asyncHandler(async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const userId = (req.user as any).id;

  const post = await createPost(title, content, userId);

  res.status(201).json({
    status: "success",
    data: { post },
  });
});
```

4. **Create Validators** (`src/middlewares/validators.ts`)
```typescript
export const validateCreatePost = [
  body("title").trim().notEmpty().isLength({ max: 255 }),
  body("content").trim().notEmpty(),
];
```

5. **Create Routes** (`src/routes/postRoutes.ts`)
```typescript
import { Router } from "express";
import { createPost, getPost } from "../controllers/postController";
import { isAuthenticated } from "../middlewares/authMiddlewares";
import { validateCreatePost, handleValidationErrors } from "../middlewares/validators";

const router = Router();

router.post(
  "/",
  isAuthenticated,
  validateCreatePost,
  handleValidationErrors,
  createPost
);

router.get("/:id", getPost);

export default router;
```

6. **Register Routes** (`src/app.ts`)
```typescript
import postRoutes from "./routes/postRoutes";
app.use("/posts", postRoutes);
```

7. **Register Model** (`src/config/database.ts`)
```typescript
import { Post } from "../models/post";

export const sequelize = new Sequelize({
  // ...
  models: [User, Post],
});
```

---

## Common Patterns & Anti-Patterns

### ✅ DO

```typescript
// Use async/await
const user = await User.findByPk(id);

// Use early returns
if (!user) {
  throw new AppError("User not found", 404);
}

// Use descriptive variable names
const isEmailValid = validateEmail(email);

// Use const by default
const MAX_RETRIES = 3;

// Extract magic numbers
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
```

### ❌ DON'T

```typescript
// Don't use callbacks (use async/await)
User.findByPk(id, (err, user) => { ... });

// Don't use var
var user = { ... };

// Don't use magic numbers
setTimeout(callback, 86400000); // What is this?

// Don't nest deeply
if (user) {
  if (user.isActive) {
    if (user.email) {
      // ...
    }
  }
}

// Don't ignore errors
try {
  await someOperation();
} catch (err) {
  // Empty catch block
}
```

---

## Conclusion

This boilerplate provides a solid foundation for building scalable Express.js applications. Key takeaways:

- **Follow the layered architecture** - Keep concerns separated
- **Apply DRY principles** - Extract reusable code
- **Write in English** - Code and comments
- **Type everything** - Leverage TypeScript
- **Handle errors gracefully** - Use custom error classes
- **Validate all inputs** - Use express-validator
- **Secure by default** - Helmet, CORS, bcrypt, sessions
- **Test thoroughly** - Unit, integration, e2e
- **Document as you go** - JSDoc and inline comments

For questions or contributions, please refer to the repository documentation.

---

**Last Updated:** 2025-11-04
**Version:** 1.0.0
