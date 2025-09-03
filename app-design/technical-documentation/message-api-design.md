# Message API Implementation & Endpoint Design

## Overview
This document describes the implementation and design of the message-related API endpoints in the Mystery Message application. It covers the purpose, flow, and tasks for each endpoint, ensuring clarity for future development and maintenance.

---

## API Endpoints

| Endpoint                       | Method | Purpose                                 |
|--------------------------------|--------|-----------------------------------------|
| `/api/send-message`            | POST   | Send a message to a user                |
| `/api/get-messages`            | GET    | Retrieve messages for the authenticated user |
| `/api/accept-messages`         | POST   | Toggle message acceptance for user       |
| `/api/accept-messages`         | GET    | Get current message acceptance status    |

---

## Endpoint Details & Flow

### `/api/send-message` (POST)
**Purpose:**
Allows anyone to send a message to a user (if they accept messages).

**Flow:**
1. Connect to DB.
2. Extract `username` and `content` from request.
3. Find user by `username`.
4. Check if user exists and is accepting messages.
5. Add message to user's messages array.
6. Save user and respond with success/error.

**Tasks:**
- Validate input.
- Check user existence and acceptance.
- Store message with timestamp.

---

### `/api/get-messages` (GET)
**Purpose:**
Authenticated users can fetch their received messages.

**Flow:**
1. Authenticate user via session.
2. Connect to DB.
3. Aggregate messages for the user, sorted by date.
4. Return messages or error.

**Tasks:**
- Ensure authentication.
- Efficiently fetch and sort messages.

---

### `/api/accept-messages` (POST/GET)
**Purpose:**
Authenticated users can toggle whether they accept messages and check current status.

**POST Flow:**
1. Authenticate user.
2. Connect to DB.
3. Update `isAcceptingMessage` field for user.
4. Respond with updated status.

**GET Flow:**
1. Authenticate user.
2. Connect to DB.
3. Fetch current `isAcceptingMessage` status.
4. Respond with status.

**Tasks:**
- Securely update and fetch acceptance status.

---

## Implementation Best Practices
- **Authentication:** Use session-based authentication for endpoints that require user context.
- **Validation:** Validate all incoming data using Zod schemas.
- **Error Handling:** Return structured responses with `success`, `message`, and appropriate HTTP status codes.
- **Database Connection:** Always connect to MongoDB before performing operations.
- **Modularity:** Keep business logic in helpers/models for reusability.

---

## Example API Response Structure
```json
{
  "success": true,
  "message": "Message sent successfully",
  "messages": [ /* array of messages if applicable */ ]
}
```

---

## Summary
- Each endpoint has a clear responsibility.
- Authentication and validation are enforced.
- Responses are standardized for frontend consumption.
- The design is modular and scalable for future features.

---

**Reference files:**
- `my-app/src/app/api/accept-messages/route.ts`
- `my-app/src/app/api/get-messages/route.ts`
- `my-app/src/app/api/send-message/route.ts`
- `my-app/src/model/User.ts`
- `my-app/src/lib/dbConnect.ts`
- `my-app/src/auth.ts`

For details on validation, see the Zod schemas in `src/schemas/`.
