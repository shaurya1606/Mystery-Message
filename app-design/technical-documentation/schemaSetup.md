# Mystery Message Feature - Technical Documentation

---

## 📁 Project Structure

```
my-app/
├── .gitignore
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
├── tsconfig.json
├── public/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── lib/
│   │   └── dbConnect.ts
│   ├── model/
│   │   └── User.ts
│   └── schemas/
│       ├── acceptMessageSchema.ts
│       ├── messageSchema.ts
│       ├── signInSchema.ts
│       ├── signUpSchema.ts
│       └── verifySchema.ts
```

---

## 🚀 Initialization Steps

1. **Project Setup**
    - Initialized a Next.js project with TypeScript.
    - Installed dependencies: `mongoose`, `next`, `eslint`, `postcss`, etc.
    - Configured TypeScript (`tsconfig.json`) and ESLint (`eslint.config.mjs`).

2. **Folder Structure**
    - `src/app`: Contains global styles, layout, and main page.
    - `src/lib`: Contains database connection logic (`dbConnect.ts`).
    - `src/model`: Contains Mongoose models.
    - `src/schemas`: Contains validation schemas for various features.

3. **Database Connection**
    - Created `src/lib/dbConnect.ts` to manage MongoDB connections using Mongoose.
    - Utilizes environment variables from `.env` for secure configuration.
    - Ensures single connection instance for performance and reliability.

---

## 📦 Libraries Used

| Library         | Purpose                                    |
|-----------------|--------------------------------------------|
| `mongoose`      | MongoDB ODM for schema/model management    |
| `next`          | React framework for SSR and routing        |
| `eslint`        | Linting and code quality                   |
| `postcss`       | CSS processing                             |
| `typescript`    | Type safety and modern JS features         |
| `zod`           | TypeScript-first schema validation         |

---

## 🧩 Schema Design

### 1. **User Model (`User.ts`)**

- **Imports:**
    - `mongoose`, `Schema`, `Document`
- **Interfaces:**
    - `Message`: Represents a message with content and timestamp.
    - `User`: Represents a user with authentication and message fields.
- **Schemas:**
    - `MessageSchema`: Embedded in `UserSchema` for storing messages.
    - `UserSchema`: Stores user info, verification, and messages.

#### User Document Structure

| Field               | Type      | Description                          |
|---------------------|-----------|--------------------------------------|
| `username`          | String    | Unique username                      |
| `email`             | String    | Unique email, validated              |
| `password`          | String    | Hashed password                      |
| `verifyCode`        | String    | Code for email verification          |
| `verifyCodeExpiry`  | Date      | Expiry for verification code         |
| `isVerified`        | Boolean   | Email verified status                |
| `isAcceptingMessage`| Boolean   | Can receive messages                 |
| `messages`          | Array     | List of received messages            |

#### Message Document Structure

| Field      | Type   | Description           |
|------------|--------|----------------------|
| `content`  | String | Message text         |
| `createdAt`| Date   | Timestamp            |

---

### 2. **Validation Schemas (`schemas/`)**

| File                   | Purpose                                  |
|------------------------|------------------------------------------|
| `signUpSchema.ts`      | Validates user registration              |
| `verifySchema.ts`      | Validates email/code verification        |
| `signInSchema.ts`      | Validates user login                     |
| `acceptMessageSchema.ts`| Validates message acceptance toggle      |
| `messageSchema.ts`     | Validates message content                |

---

### 3. **Database Connection (`lib/dbConnect.ts`)**

- **Purpose:**  
  Centralizes MongoDB connection logic for the app.
- **Process:**
    1. Imports `mongoose`.
    2. Reads MongoDB URI from environment variables (`.env`).
    3. Checks for existing connection to avoid multiple instances.
    4. Connects to MongoDB and exports the connection for use in models and API routes.
- **Example Code:**

```typescript
// filepath: d:\Mystry Message\my-app\src\lib\dbConnect.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

let cached = (global as any).mongoose || { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  (global as any).mongoose = cached;
  return cached.conn;
}

export default dbConnect;
```

- **Usage:**
    - Import `dbConnect` in API routes or server-side logic before accessing models.
    - Ensures database is connected before performing operations.

---

## 🏗️ Design Patterns & Decisions

### 1. **Model-Driven Design**
   - Centralized user and message data in Mongoose models.
   - Embedded message schema for efficient user-message relationship.

### 2. **Validation Layer**
   - Separate validation schemas for each feature.
   - Ensures data integrity before database operations.

### 3. **Modular Structure**
   - Clear separation between models, schemas, UI, and database logic.
   - Easy to extend and maintain.

### 4. **Type Safety**
   - TypeScript interfaces for all models and schemas.
   - Reduces runtime errors and improves developer experience.

### 5. **Connection Management**
   - Singleton pattern for MongoDB connection.
   - Prevents redundant connections and improves performance.

---

## 🔄 Data Flow Diagram

```mermaid
graph TD
    A[User Registration] -->|signUpSchema| B(User Model)
    B --> C{Verification}
    C -->|verifySchema| D[Verified User]
    D -->|signInSchema| E[Login]
    E -->|acceptMessageSchema| F[Accepting Messages]
    F -->|messageSchema| G[Message Stored]
    B -->|dbConnect| H[(MongoDB)]
```

---

## 📝 Example: User Model Code

```typescript
import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document{
    content: string;
    createdAt: Date
}

const MessageSchema: Schema<Message> = new Schema({
    content: { type:String, required: true },
    createdAt: { type:Date, required: true, default: Date.now }
})

export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
    username: { type:String, required:[true, "Username is required"], trim: true, unique: true },
    email: { type:String, required: [true, "Email is required"], unique: true, match: [/.+\@.+\..+/, 'please use a valid email address'] },
    password: { type: String, required: [true, "Password is required"], minlength: [6, "Password must be at least 6 characters long"], maxlength: [100, "Password must be at most 100 characters long"] },
    verifyCode: { type: String, required: [true, "Verification code is needed"] },
    verifyCodeExpiry: { type: Date, required: [true, "Verification code expiry is needed"] },
    isVerified: { type:Boolean, default: true },
    isAcceptingMessage: { type: Boolean, default: true },
    messages: [MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", UserSchema))

export default UserModel;
```

---

## 🏁 Summary

- **Modular, type-safe, and scalable design.**
- **Clear separation of concerns (models, schemas, UI, database connection).**
- **Validation at every step for robust data integrity.**
- **Singleton database connection for reliability and performance.**
- **Ready for