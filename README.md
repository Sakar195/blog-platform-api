# Blog Platform API

A comprehensive RESTful API for a blog platform built with Node.js, Express, MongoDB, and JWT authentication.

## Features

- 🔐 **User Authentication** - JWT-based registration and login
- 📝 **Blog Management** - Complete CRUD operations for blog posts
- 💬 **Comment System** - Add, update, and delete comments on blogs
- 🏷️ **Tag System** - Organize blogs with tags
- 🔍 **Advanced Search** - Text search, filtering, and sorting
- 📄 **Pagination** - Efficient data loading with pagination
- 🛡️ **Rate Limiting** - Protection against spam and abuse
- ✅ **Input Validation** - Comprehensive data validation
- 🔒 **Authorization** - Users can only modify their own content

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Security**: bcryptjs for password hashing, express-rate-limit
- **Development**: Nodemon for hot reloading

## Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Sakar195/blog-platform-api.git
cd blog-platform-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database
MONGO_URI=mongodb://localhost:27017/blog-platform
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/blog-platform

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server
PORT=5000
```

### 4. Start the Server

**Development Mode:**

```bash
npm run dev
```

**Production Mode:**

```bash
npm start
```

## Deployment

This API is deployed on **Railway** and accessible at:
```
https://blog-platform-api-production-bb0a.up.railway.app/api
```

### Deploy to Railway

1. Connect your GitHub repository to Railway
2. Set up environment variables in Railway dashboard:
   - `MONGO_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Your JWT secret key  
   - `JWT_EXPIRES_IN` - Token expiration (default: 7d)
3. **Configure MongoDB Atlas** (if using):
   - Go to MongoDB Atlas → Network Access
   - Add IP Address: `0.0.0.0/0` (allow from anywhere) for Railway deployment
4. Railway will automatically deploy from your main branch

**Important**: The code includes `app.set('trust proxy', 1)` to handle Railway's proxy configuration.

### 5. Seed the Database (Optional)

Populate the database with sample data:

```bash
npm run seed
```

This creates test users:

- Email: `john@example.com` / Password: `password123`
- Email: `jane@example.com` / Password: `password123`

## Project Structure

```
blog-platform-api/
├── controllers/          # Request handlers and business logic
│   ├── authController.js    # Authentication logic
│   ├── blogController.js    # Blog operations
│   ├── commentController.js # Comment operations
│   └── tagController.js     # Tag operations
├── middleware/           # Custom middleware functions
│   ├── authMiddleware.js    # JWT authentication middleware
│   ├── errorHandler.js      # Global error handling
│   ├── rateLimiter.js       # Rate limiting configuration
│   └── validationMiddleware.js # Input validation
├── models/               # Database schemas
│   ├── User.js             # User schema
│   ├── Blog.js             # Blog schema
│   ├── Comment.js          # Comment schema
│   └── Tag.js              # Tag schema
├── routes/               # API route definitions
│   ├── authRoutes.js       # Authentication routes
│   ├── blogRoutes.js       # Blog routes
│   ├── commentRoutes.js    # Comment routes
│   └── tagRoutes.js        # Tag routes
├── utils/                # Utility functions
│   └── seed.js             # Database seeding script
├── app.js                # Express app configuration
├── package.json          # Dependencies and scripts
└── .env                  # Environment variables
```

## API Documentation

### Base URLs

**Local Development:**
```
http://localhost:5000/api
```

**Production (Railway):**
```
https://blog-platform-api-production-bb0a.up.railway.app/api
```

**Example Endpoints:**
- Get all blogs: `https://blog-platform-api-production-bb0a.up.railway.app/api/blogs`
- Register user: `https://blog-platform-api-production-bb0a.up.railway.app/api/auth/register`
- Login user: `https://blog-platform-api-production-bb0a.up.railway.app/api/auth/login`

Use the appropriate base URL depending on your environment.

### Authentication Routes

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "createdAt": "2025-08-03T10:30:00.000Z"
  }
}
```

#### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "password123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "createdAt": "2025-08-03T10:30:00.000Z"
  }
}
```

#### Get User Profile (Protected)

```http
GET /api/auth/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Update User Profile (Protected)

```http
PUT /api/auth/profile
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
    "username": "newusername",
    "email": "newemail@example.com"
}
```

### Blog Routes

#### Get All Blogs (Public)

```http
GET /api/blogs
```

**Query Parameters:**

- `search` - Text search in title and description
- `tags` - Filter by tags (comma-separated)
- `sortBy` - Sort by: `title`, `-title`, `date`, `-date`
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `startDate` - Filter by creation date (from)
- `endDate` - Filter by creation date (to)

**Example:**

```http
GET /api/blogs?search=javascript&tags=programming,webdev&sortBy=-date&page=1&limit=5
```

#### Get Single Blog (Public)

```http
GET /api/blogs/:id
```

#### Create Blog (Protected)

```http
POST /api/blogs
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
    "title": "Getting Started with Node.js",
    "description": "A comprehensive guide to Node.js development",
    "tags": "nodejs,javascript,backend"
}
```

#### Update Blog (Protected - Author Only)

```http
PUT /api/blogs/:id
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
    "title": "Updated Blog Title",
    "description": "Updated description",
    "tags": "updated,tags"
}
```

#### Delete Blog (Protected - Author Only)

```http
DELETE /api/blogs/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

### Comment Routes

#### Get Comments for Blog (Public)

```http
GET /api/comments/blog/:blogId
```

#### Add Comment to Blog (Protected)

```http
POST /api/comments/blog/:blogId
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
    "text": "Great article! Very helpful."
}
```

#### Update Comment (Protected - Author Only)

```http
PUT /api/comments/:id
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
    "text": "Updated comment text"
}
```

#### Delete Comment (Protected - Author Only)

```http
DELETE /api/comments/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

### Tag Routes

#### Get All Tags (Public)

```http
GET /api/tags
```

#### Get Single Tag (Public)

```http
GET /api/tags/:id
```

#### Create Tag (Public)

```http
POST /api/tags
Content-Type: application/json

{
    "name": "javascript"
}
```

#### Update Tag (Public)

```http
PUT /api/tags/:id
Content-Type: application/json

{
    "name": "updated-tag-name"
}
```

#### Delete Tag (Public)

```http
DELETE /api/tags/:id
```

## Authentication

This API uses JWT (JSON Web Tokens) for authentication. After login/registration, include the token in requests:

```http
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

### Protected Routes

Routes that require authentication:

- `POST /api/blogs` - Create blog
- `PUT /api/blogs/:id` - Update blog (author only)
- `DELETE /api/blogs/:id` - Delete blog (author only)
- `POST /api/comments/blog/:id` - Add comment
- `PUT /api/comments/:id` - Update comment (author only)
- `DELETE /api/comments/:id` - Delete comment (author only)
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Public Routes

Routes accessible without authentication:

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get single blog
- `GET /api/comments/blog/:id` - Get comments
- All tag routes

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **General API**: 100 requests per 15 minutes per IP
- **Write Operations**: 30 requests per hour per IP
- **Comments**: 10 requests per 15 minutes per IP
- **Authentication**: 5 requests per 15 minutes per IP

## Error Handling

The API returns consistent error responses:

```json
{
  "message": "Error description"
}
```

Common status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (not authorized for this resource)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## Testing with Postman

1. **Import the collection** (if available) or create requests manually
2. **Set up environment variables**:
   - `baseUrl`: `http://localhost:5000/api`
   - `token`: Your JWT token after login
3. **For protected routes**: Add header `Authorization: Bearer {{token}}`

### Testing Flow:

1. Register a new user or login with test users
2. Copy the JWT token from the response
3. Use the token for protected routes
4. Test CRUD operations for blogs and comments
5. Verify authorization (try to edit someone else's content)
