# Validation System Design & Implementation Document

## 1. Overview

This document outlines the steps and structure for implementing a validation system from scratch. It covers requirements, database schema, API endpoints, process flow, methods used, and a breakdown of each stage.

---

## 2. Requirements

- List all fields requiring validation.
- Specify validation rules (e.g., required, format, uniqueness).
- Define when validation occurs (on input, on submit, after registration).
- Identify error message formats.

---

## 3. Database Schema

| Field               | Type      | Description                       |
|---------------------|-----------|-----------------------------------|
| username            | String    | Unique identifier for user        |
| email               | String    | Unique email address              |
| password            | String    | Hashed password                   |
| verificationCode    | String    | Code for account verification     |
| verificationExpiry  | Date      | Expiry time for verification code |
| isVerified          | Boolean   | Account verification status       |
| validationAttempts  | Number    | Number of validation attempts     |

---

## 4. API Endpoints

| Endpoint                      | Method | Purpose                        |
|-------------------------------|--------|--------------------------------|
| /api/check-username-unique    | POST   | Check if username is unique    |
| /api/verify-code              | POST   | Verify account with code       |
| /api/register                 | POST   | Register new user              |
| /api/resend-verification      | POST   | Resend verification code       |

---

## 5. Process Flow

### Registration & Validation Flowchart

```
[Start] 
   |
   v
[User submits registration form]
   |
   v
[Server validates fields]
   |
   v
[Check username/email uniqueness] ---> [If not unique] ---> [Return error]
   |
   v
[Create user record with verification code]
   |
   v
[Send verification code to user]
   |
   v
[User submits verification code]
   |
   v
[Server checks code and expiry]
   |
   v
[If valid] ---> [Set isVerified true] ---> [Success]
   |
   v
[If invalid/expired] ---> [Return error]
   |
   v
[End]
```

---

## 6. Methods Used

- **Field Validation**: Check required fields, format, length.
- **Uniqueness Validation**: Query database for existing values.
- **Verification Code Generation**: Create random code, set expiry.
- **Verification Code Validation**: Compare submitted code with stored code, check expiry.
- **Error Handling**: Return structured error messages.

---

## 7. Implementation Breakdown

### Step 1: Define Validation Rules
- Specify rules for each field (e.g., username must be unique, password min length).

### Step 2: Database Model Setup
- Add fields for validation and verification in user schema.

### Step 3: API Route Creation
- Implement endpoints for registration, uniqueness check, code verification, and code resend.

### Step 4: Server-Side Validation
- Validate input data on API routes.
- Generate and store verification codes.
- Handle verification logic and update user status.

### Step 5: Client-Side Validation
- Validate fields before submission.
- Display error messages and validation status.

### Step 6: Verification Process
- Send code to user.
- Accept code input.
- Validate code and update verification status.

### Step 7: Error and Status Reporting
- Return structured responses for success and failure.
- Log validation attempts and errors.

---

## 8. Tables and Arrows

- Use tables for schema and endpoint documentation.
- Use arrows in flowcharts to indicate process direction.

---

## 9. Summary

This document provides a step-by-step guide to designing and implementing a validation system, including requirements, schema, endpoints, flowcharts, and process breakdowns.
