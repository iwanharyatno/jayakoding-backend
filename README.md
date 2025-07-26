# JayaKoding Backend API

This is the backend API for the JayaKoding project, providing functionalities for user authentication and article/project management.

## Table of Contents

- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Articles & Projects](#articles--projects)
  - [Feedback](#feedback)

## Installation
- **Endpoint:** `POST /feedback`
- **Description:** Sends an email with the user's feedback to the contact email specified in the server's environment variables.
- **Access:** Public
- **Request Body:** `application/json`
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "message": "This is my feedback."
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "message": "Feedback sent successfully"
  }
  ```
- **Error Response (400 Bad Request):**
  ```json
  {
    "message": "All fields are required"
  }
  ```
- **Error Response (500 Internal Server Error):**
  ```json
  {
    "message": "Failed to send feedback"
  }
  ```


1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd jayakoding-backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the following variables. Replace the placeholder values with your actual configuration.

    ```env
    MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
    JWT_SECRET=your_super_secret_jwt_key
    APP_URL=http://localhost:5000
    ```

## Running the Application

### Starting the Server

To start the API server, run the following command:

```bash
npm start
```

The server will start on the port specified in your `.env` file or on port 5000 by default.

### Adding a New User

User registration is handled via a command-line interface to ensure only authorized administrators can create new users.

```bash
npm run addUser
```

You will be prompted to enter a username and password for the new user.

---

## API Endpoints

All endpoints are prefixed with `/api`.

### Authentication

#### Login
- **Endpoint:** `POST /auth/login`
- **Description:** Authenticates a user with a username and password and returns a JSON Web Token (JWT) upon success.
- **Access:** Public
- **Request Body:** `application/json`
  ```json
  {
    "username": "testuser",
    "password": "password123"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Error Response (400 Bad Request):**
  ```json
  {
    "message": "Invalid credentials"
  }
  ```

---

### Articles & Projects

#### Create an Article or Project
- **Endpoint:** `POST /articles`
- **Description:** Creates a new article or project. Requires `multipart/form-data` for the image upload.
- **Access:** Private (Requires JWT)
- **Request Body:** `multipart/form-data`
  - `title` (String): The title of the post.
  - `content` (String): The main content of the post.
  - `category` (String): Must be either `article` or `project`.
  - `cover_image` (File): The image file for the cover.
- **Success Response (201 Created):**
  ```json
  {
    "_id": "60d21b4667d0d8992e610c85",
    "title": "My First Article",
    "content": "This is the full content of the article.",
    "category": "article",
    "cover_image": "storage\\cover_image-1624382278333.jpg",
    "createdAt": "2025-07-26T18:37:58.344Z",
    "updatedAt": "2025-07-26T18:37:58.344Z",
    "cover_image_public": "http://localhost:5000/storage/cover_image-1624382278333.jpg"
  }
  ```

#### Get All Articles and Projects
- **Endpoint:** `GET /articles`
- **Description:** Retrieves a list of all articles and projects. The `content` is truncated to a 20-word preview.
- **Access:** Public
- **Success Response (200 OK):**
  ```json
  [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "title": "My First Article",
      "content": "This is the truncated content of the article...",
      "category": "article",
      "cover_image_public": "http://localhost:5000/storage/cover_image-1624382278333.jpg"
    }
  ]
  ```

#### Get Articles by Category
- **Endpoint:** `GET /articles/:category`
- **Description:** Retrieves a list of all posts for a specific category (`article` or `project`). The `content` is truncated.
- **Access:** Public
- **URL Parameters:**
  - `category`: `article` or `project`
- **Success Response (200 OK):**
  ```json
  [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "title": "My Awesome Project",
      "content": "This is the truncated content of the project...",
      "category": "project",
      "cover_image_public": "http://localhost:5000/storage/cover_image-1624382278334.jpg"
    }
  ]
  ```

#### Get a Single Article or Project
- **Endpoint:** `GET /articles/:id`
- **Description:** Retrieves a single article or project by its ID with the full, untruncated content.
- **Access:** Public
- **URL Parameters:**
  - `id`: The ID of the article or project.
- **Success Response (200 OK):**
  ```json
  {
    "_id": "60d21b4667d0d8992e610c85",
    "title": "My First Article",
    "content": "This is the full, untruncated content of the article.",
    "category": "article",
    "cover_image_public": "http://localhost:5000/storage/cover_image-1624382278333.jpg"
  }
  ```
- **Error Response (404 Not Found):**
  ```json
  {
    "message": "Article not found"
  }
  ```

#### Update an Article or Project
- **Endpoint:** `PUT /articles/:id`
- **Description:** Updates an existing article or project. All fields are optional. If a new `cover_image` is uploaded, the old one is deleted.
- **Access:** Private (Requires JWT)
- **URL Parameters:**
  - `id`: The ID of the post to update.
- **Request Body:** `multipart/form-data`
  - `title` (String, Optional)
  - `content` (String, Optional)
  - `category` (String, Optional): `article` or `project`
  - `cover_image` (File, Optional)
- **Success Response (200 OK):** Returns the updated article object.

#### Delete an Article or Project
- **Endpoint:** `DELETE /articles/:id`
- **Description:** Deletes an article or project and its associated cover image from storage.
- **Access:** Private (Requires JWT)
- **URL Parameters:**
  - `id`: The ID of the post to delete.
- **Success Response (200 OK):**
  ```json
  {
    "message": "Article removed"
  }
  ```

