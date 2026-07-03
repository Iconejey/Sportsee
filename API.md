# SportSee Backend API Documentation

The backend service is running locally on port `8000`.

## Base URL
```
http://localhost:8000
```

---

## Authentication

All data endpoints require JWT authentication. 
To authenticate:
1. Call `POST /api/login` with valid credentials.
2. Store the returned `token`.
3. Include the token in subsequent requests as a Bearer token in the `Authorization` header:
   ```http
   Authorization: Bearer <your_jwt_token>
   ```

### Demo Accounts

Use one of these three accounts to log in:

| Username | Password | User ID | Name |
|---|---|---|---|
| `sophiemartin` | `password123` | `user123` | Sophie Martin |
| `emmaleroy` | `password789` | `user456` | Emma Leroy |
| `marcdubois` | `password456` | `user789` | Marc Dubois |

---

## Endpoints

### 1. User Login
Authenticates a user and returns a session token.

* **URL**: `/api/login`
* **Method**: `POST`
* **Headers**: `Content-Type: application/json`
* **Body Parameters**:
  ```json
  {
    "username": "sophiemartin",
    "password": "password123"
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "userId": "user123"
  }
  ```
* **Error Responses**:
  * **400 Bad Request**: Missing username or password.
    ```json
    { "message": "username and password are required" }
    ```
  * **401 Unauthorized**: Invalid credentials.
    ```json
    { "message": "Invalid credentials" }
    ```

---

### 2. Get User Information
Returns profile information, weekly goals, and summary statistics.

* **URL**: `/api/user-info`
* **Method**: `GET`
* **Headers**: `Authorization: Bearer <token>`
* **Success Response (200 OK)**:
  ```json
  {
    "profile": {
      "firstName": "Sophie",
      "lastName": "Martin",
      "createdAt": "2025-01-01",
      "age": 32,
      "weight": 60,
      "height": 165,
      "profilePicture": "http://localhost:8000/images/sophie.jpg"
    },
    "statistics": {
      "totalDistance": "345.2",
      "totalSessions": 72,
      "totalDuration": 2420
    }
  }
  ```
* **Error Responses**:
  * **401 Unauthorized**: Missing or invalid token.

---

### 3. Get User Activity
Returns running sessions between two dates. Filters out future dates and returns results sorted chronologically (ascending).

* **URL**: `/api/user-activity`
* **Method**: `GET`
* **Headers**: `Authorization: Bearer <token>`
* **Query Parameters**:
  * `startWeek` (required): ISO Date String (e.g. `2025-01-01`)
  * `endWeek` (required): ISO Date String (e.g. `2025-01-07`)
* **Success Response (200 OK)**:
  ```json
  [
    {
      "date": "2025-01-04",
      "distance": 5.8,
      "duration": 38,
      "heartRate": {
        "min": 140,
        "max": 178,
        "average": 163
      },
      "caloriesBurned": 422
    },
    {
      "date": "2025-01-05",
      "distance": 3.2,
      "duration": 20,
      "heartRate": {
        "min": 148,
        "max": 184,
        "average": 171
      },
      "caloriesBurned": 248
    }
  ]
  ```
* **Error Responses**:
  * **400 Bad Request**: Missing query parameters.
    ```json
    { "message": "startWeek and endWeek are required" }
    ```
  * **401/403 Unauthorized**: Invalid or expired token.
  * **404 Not Found**: User not found.
    ```json
    { "message": "User not found" }
    ```

---

### 4. Static Profile Images
Serves static profile images.

* **URL**: `/images/:imageName`
* **Method**: `GET`
* **Examples**:
  * `http://localhost:8000/images/sophie.jpg`
  * `http://localhost:8000/images/emma.jpg`
  * `http://localhost:8000/images/marc.jpg`
