

## User Routes Documentation

### 1. Register a New User

**Endpoint**

* **Method:** `POST` 
* **Path:** `/register` 

---

#### Description

Create a new user account.
Validates the incoming data, hashes the password, saves the user in MongoDB, and returns a JWT auth token along with the created user object.

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

  * Minimum length: 3 characters
  * Validated by `express-validator` in the route. 

* `fullname.lastname` (string, optional but part of schema)

  * Minimum length: 3 characters (schema-level rule). 

* `email` (string, required)

  * Must be a valid email format (route-level validation).
  * Must be unique in DB (schema-level).
  * Minimum length: 5 characters.

* `password` (string, required)

  * Minimum length: 6 characters (route-level validation). 

---

#### Validation

The following validations are applied using `express-validator`: 

* `body("email").isEmail()`

  * Error message: `"Please provide a valid email address"`

* `body("fullname.firstname").isLength({ min: 3 })`

  * Error message: `"Firstname must be at least 3 characters long"`

* `body("password").isLength({ min: 6 })`

  * Error message: `"Password must be at least 6 characters long"`

If validation fails, the controller returns:

* **Status:** `400 Bad Request`
* **Body:**

  ```json
  {
    "errors": [
      {
        "msg": "Firstname must be at least 3 characters long",
        "param": "fullname.firstname",
        "location": "body"
      }
      // ...
    ]
  }
  ```

  (Structure is from `validationResult().array()`.) 

---

#### Processing Logic (Controller Flow)

Inside `registerUser`:

1. **Check validation errors** using `validationResult(req)`.
2. If errors exist → return `400` with `errors` array.
3. If valid:

   * Extract `{ fullname, email, password }` from `req.body`.
   * Hash the plain password using:

     ```js
     const hashedPassword = await userModel.hashPassword(password);
     ```

     `hashPassword` uses `bcrypt.hash(password, 10)` (10 salt rounds). 
   * Create user via `userService.createUser(...)` with:

     ```js
     {
       firstname: fullname.firstname,
       lastname: fullname.lastname,
       email,
       password: hashedPassword
     }
     ```
   * Generate JWT token:

     ```js
     const token = user.generateAuthToken();
     ```

     which internally does:

     ````js
     jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
     ``` :contentReference[oaicite:10]{index=10}  

     ````
4. Respond with:

* **Status:** `201 Created`
* **Body:**

  ```json
  {
    "token": "<jwt_token_here>",
    "user": {
      // user document fields except password (because `select: false`)
    }
  }
  ```

---

#### Responses Summary

* **201 Created**

  * User successfully registered.
  * Returns JWT token and user data (without password).

* **400 Bad Request**

  * Validation failed.
  * `errors` array explains each problem.

* **500 Internal Server Error (implicit)**

  * If something unexpected throws inside controller / DB operations.
  * Not explicitly handled in your code yet, but could be caught by an error-handling middleware.

---

#### Authentication

* **Public route:**

  * No token required to call `/register`.
  * This route itself *creates* the token for the new user.

---

#### Example cURL

```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {
      "firstname": "Harsh",
      "lastname": "Shukla"
    },
    "email": "harsh@example.com",
    "password": "secret123"
  }'
```

---
