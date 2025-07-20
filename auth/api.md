# SafeTrace Auth API Documentation

Base URL: `/api/auth`

---

## Endpoints

### 1. Health Check

**GET** `/api/auth`

- **Description:** Simple health check endpoint.
- **Response:**
  - `200 OK`: `"Hello, World!"`

---

### 2. User Signup

**POST** `/api/auth/signup`

- **Description:** Register a new user.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "string (min 6 chars)",
    "username": "string",
    "image": "string (optional)"
  }
  ```
- **Response:**
  - `202 Accepted` (success)
    ```json
    {
      "token": "jwt_token",
      "data": { /* user object */ },
      "message": "Successfully created a new user",
      "success": true,
      "err": null
    }
    ```
  - `400 Bad Request` (invalid input)
  - `500 Internal Server Error` (creation failed)

---

### 3. User Signin

**POST** `/api/auth/signin`

- **Description:** Authenticate an existing user.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "string"
  }
  ```
- **Response:**
  - `202 Accepted` (success)
    ```json
    {
      "token": "jwt_token",
      "data": { /* user object */ },
      "message": "User Successfully signed in.",
      "success": true,
      "err": null
    }
    ```
  - `400 Bad Request` (invalid input)
  - `500 Internal Server Error` (invalid credentials or other error)

---

### 4. Get Username by ID

**GET** `/api/auth/username/:id`

- **Description:** Retrieve a username by user ID.
- **Path Parameter:**
  - `id` (integer, required): User ID
- **Response:**
  - `202 Accepted` (success)
    ```json
    {
      "data": "username",
      "message": "returned username successfully.",
      "success": true,
      "err": null
    }
    ```
  - `400 Bad Request` (invalid ID)
  - `500 Internal Server Error` (user not found or other error)

---

## Common Error Response

```json
{
  "data": null,
  "message": "Error message",
  "success": false,
  "err": "Error details"
}
```

---

## Notes

- All endpoints return JSON.
- JWT tokens are returned on successful signup/signin and should be used for authenticated requests (if required by future endpoints).
- The API is CORS-enabled for `http://localhost:8080`. 