
### 1. Register a New User

**Endpoint**

* **Method:** `POST`
* **Path:** `/register`

---

#### Description

Create a new user account.
Validates input, hashes the password with `bcrypt`, saves the user in MongoDB, and returns a JWT token with the created user.

---

#### Request Body (JSON)

```json
{
  "fullname": {
    "firstname": "Harsh",
    "lastname": "Shukla"
  },
  "email": "user@example.com",
  "password": "secret123"
}
```

**Fields**

* `fullname.firstname` (string, required)

  * Min length: 3

* `fullname.lastname` (string, optional, but in schema)

  * Min length: 3

* `email` (string, required)

  * Valid email, unique, min length 5

* `password` (string, required)

  * Min length: 6

---

#### Processing Logic (Flow)

1. Check `validationResult(req)` → if errors, return `400`. 
2. Get `{ fullname, email, password }` from `req.body`.
3. Hash password: `userModel.hashPassword(password)` (uses `bcrypt.hash(..., 10)`). 
4. Create user via `userService.createUser({ firstname, lastname, email, password: hashedPassword })`. 
5. Generate JWT: `user.generateAuthToken()` (24h expiry). 
6. Return `201` with `{ token, user }`.

---

#### Responses Summary

* **201 Created** → User created, returns `{ token, user }`
* **400 Bad Request** → Validation errors
* **500 Internal Server Error** → Any unexpected error (if handled by global middleware)

---

#### Authentication

* **Public route** (no token needed).
* This route **creates** the JWT.

---

#### Example cURL

```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": { "firstname": "Harsh", "lastname": "Shukla" },
    "email": "harsh@example.com",
    "password": "secret123"
  }'
```

---

### 2. Login User

**Endpoint**

* **Method:** `POST`
* **Path:** `/login`

---

#### Description

Login an existing user.
Validates email & password, checks credentials, generates JWT token, sets it in cookie, and returns token + user.

---

#### Request Body (JSON)

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

**Fields**

* `email` (string, required) – must be a valid email
* `password` (string, required) – min length 6

---

#### Processing Logic (Flow)

1. Check `validationResult(req)` → if errors, return `400`.
2. Get `{ email, password }` from `req.body`.
3. Find user: `userModel.findOne({ email }).select("+password")`.
4. If no user → **401** `"Invalid email or password"`.
5. Compare password: `user.comparePassword(password)` (uses `bcrypt.compare`). 
6. If mismatch → **401** `"Invalid email or password"`.
7. Generate JWT: `user.generateAuthToken()`.
8. Set cookie: `res.cookie("token", token)` and respond with `{ token, user }`. 

---

#### Responses Summary

* **200 OK**

  ```json
  {
    "token": "<jwt>",
    "user": { /* user fields */ }
  }
  ```
* **400 Bad Request** → Validation error
* **401 Unauthorized** → Wrong email or password

---

#### Authentication

* **Public route** (no token needed).
* This route **creates** a new JWT and sets it in cookie `token`.

---

#### Example cURL

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "harsh@example.com",
    "password": "secret123"
  }'
```

---

### 3. Get User Profile

**Endpoint**

* **Method:** `GET`
* **Path:** `/profile`

---

#### Description

Return the currently logged-in user’s data.
Uses `authUser` middleware to verify token and load user from DB.

---

#### Request Body

* **None**

Client must send token either:

* Cookie: `token=<jwt>`
* Header: `Authorization: Bearer <jwt>` 

---

#### Processing Logic (Flow)

1. `authUser` middleware:

   * Reads token from cookie or `Authorization` header.
   * If no token → **401** `"Unauthorized Access"`.
   * Checks blacklist collection for this token.
   * If blacklisted → **401**.
   * Verifies JWT with `jwt.verify`.
   * Finds user by ID and sets `req.user`.
2. Controller `getUserProfile`:

   * Returns `200` with `{ user: req.user }`. 

---

#### Responses Summary

* **200 OK**

  ```json
  {
    "user": { /* logged-in user data */ }
  }
  ```
* **401 Unauthorized** → Missing/invalid/blacklisted token or user not found

---

#### Authentication

* **Protected route** – requires a valid, non-blacklisted JWT.

---

#### Example cURL

```bash
curl -X GET http://localhost:3000/profile \
  -H "Authorization: Bearer <jwt_token_here>"
```

---

### 4. Logout User

**Endpoint**

* **Method:** `GET`
* **Path:** `/logout`

---

#### Description

Logout the current user.
Clears token cookie and stores the current token in the blacklist so it can’t be used again. Blacklisted tokens auto-expire after 24 hours.

---

#### Request Body

* **None**

Token is taken from:

* Cookie: `token=<jwt>`
* or Header: `Authorization: Bearer <jwt>`

---

#### Processing Logic (Flow)

1. Read token from cookie or header. 
2. `res.clearCookie("token")` to remove cookie.
3. Save token in `BlacklistToken` collection:

   ```js
   await blackListTokenModel.create({ token });
   ```

   * `createdAt` field has `expires: 86400`, so MongoDB auto-deletes it after 24 hours. 
4. Return `200` with success message.

---

#### Responses Summary

* **200 OK**

  ```json
  {
    "message": "Logged out successfully"
  }
  ```

(If token missing/invalid and you also use `authUser` before it, then **401** is possible.)

---

#### Authentication

* In your routes, `/logout` is protected by `authUser`, so a valid token is required.

---

#### Example cURL

```bash
curl -X GET http://localhost:3000/logout \
  -H "Authorization: Bearer <jwt_token_here>"
```