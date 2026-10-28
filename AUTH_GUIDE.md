# Authentication System Guide

This document explains the complete authentication system implemented in Resume Analyzer.

## 🔑 Overview

The application uses **JWT (JSON Web Token)** based authentication with the following features:
- Secure password hashing with bcryptjs
- HTTP-only token storage (localStorage)
- Protected API routes with middleware
- Auto-login on app load
- Auto-logout on token expiration

## 📂 Authentication Architecture

### Frontend
```
frontend/
├── src/
│   ├── context/
│   │   └── AuthContext.js          # Auth state management
│   ├── components/
│   │   └── ProtectedRoute.js       # Protected route wrapper
│   ├── pages/
│   │   ├── Login.js                # Login page
│   │   └── Register.js             # Registration page
│   ├── utils/
│   │   └── api.js                  # Axios instance with auth interceptors
│   └── App.js                      # Routes setup
```

### Backend
```
backend/
├── routes/
│   └── auth.js                     # Auth endpoints
├── middleware/
│   └── auth.js                     # JWT verification middleware
├── models/
│   └── User.js                     # User schema
└── server.js                       # Express setup
```

## 🔐 Frontend Authentication Flow

### 1. AuthContext (`src/context/AuthContext.js`)

Manages global authentication state using React Context:

```javascript
const { 
  user,           // Current user object
  token,          // JWT token
  loading,        // Loading state during verification
  isAuthenticated, // Boolean flag
  login,          // Login function
  register,       // Register function
  logout          // Logout function
} = useAuth();
```

**Features:**
- Automatically verifies token on app load
- Auto-login if valid token exists
- Centralizes auth logic
- Provides hooks for components

### 2. Protected Routes (`src/components/ProtectedRoute.js`)

Wraps routes that require authentication:

```jsx
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

**Behavior:**
- Shows loading spinner while verifying token
- Redirects to `/login` if not authenticated
- Renders protected component if authenticated

### 3. API Interceptor (`src/utils/api.js`)

Automatically adds auth token to all API requests:

```javascript
// Automatically adds: Authorization: Bearer {token}
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Features:**
- Auto-adds JWT to all requests
- Redirects to login on 401 errors
- Handles token expiration

## 🛠️ Backend Authentication Flow

### 1. User Model (`backend/models/User.js`)

```javascript
{
  username: String,        // Unique username
  email: String,          // Unique email
  password: String,       // Bcryptjs hashed password
  createdAt: Date         // Account creation date
}
```

### 2. Auth Routes (`backend/routes/auth.js`)

#### Register: `POST /api/auth/register`
```javascript
{
  username: string,    // Required, 3+ chars
  email: string,       // Required, valid email
  password: string     // Required, 6+ chars
}
```

**Response:**
```javascript
{
  message: "User registered successfully",
  user: { id, username, email }
}
```

**Validation:**
- Checks for existing email/username
- Validates password strength (6+ chars)
- Returns descriptive error messages

#### Login: `POST /api/auth/login`
```javascript
{
  email: string,
  password: string
}
```

**Response:**
```javascript
{
  token: "eyJhbGc...",  // JWT token (valid for 7 days)
  user: { id, username, email, createdAt }
}
```

#### Get Current User: `GET /api/auth/me`
**Headers:** `Authorization: Bearer {token}`

**Response:**
```javascript
{
  user: { id, username, email, createdAt }
}
```

#### Verify Token: `GET /api/auth/verify`
**Headers:** `Authorization: Bearer {token}`

**Response:**
```javascript
{
  valid: true,
  user: { id, username, email, createdAt }
}
```

### 3. Auth Middleware (`backend/middleware/auth.js`)

Protects routes that require authentication:

```javascript
const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

**Usage:**
```javascript
router.get('/protected-endpoint', authMiddleware, (req, res) => {
  // req.user contains: { id, email }
});
```

## 🔄 Complete Authentication Flow

### Registration Flow
```
1. User fills registration form
   ↓
2. Frontend validates inputs (password match, strength)
   ↓
3. POST /api/auth/register with { username, email, password }
   ↓
4. Backend validates and hashes password
   ↓
5. User saved to MongoDB
   ↓
6. Success message returned, redirect to login
```

### Login Flow
```
1. User enters email & password
   ↓
2. POST /api/auth/login with { email, password }
   ↓
3. Backend finds user by email
   ↓
4. Compares password with bcryptjs
   ↓
5. If valid: JWT token generated (expires in 7 days)
   ↓
6. Token stored in localStorage
   ↓
7. Redirect to dashboard
```

### Auto-Login on App Load
```
1. App mounts, AuthContext checks localStorage for token
   ↓
2. If token exists: GET /api/auth/me with Authorization header
   ↓
3. Backend verifies token and returns user data
   ↓
4. User state updated, app navigates to dashboard
   ↓
5. If invalid/expired token: localStorage cleared, redirect to login
```

### Protected Route Access
```
1. User navigates to /dashboard
   ↓
2. ProtectedRoute component renders
   ↓
3. Checks AuthContext.isAuthenticated
   ↓
4. If true: renders Dashboard component
   ↓
5. If false: redirects to /login
```

### Logout Flow
```
1. User clicks logout button
   ↓
2. logout() called from AuthContext
   ↓
3. localStorage.removeItem('token')
   ↓
4. User state cleared
   ↓
5. Redirected to /login page
```

## 🔒 Security Best Practices

### Implemented
- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ JWT tokens with expiration (7 days)
- ✅ Protected routes on frontend
- ✅ Auth middleware on backend
- ✅ Input validation on both sides
- ✅ CORS protection
- ✅ HttpOnly flag support ready

### Environment Variables
```bash
# Backend .env
JWT_SECRET=your_super_secret_key_at_least_32_chars_long
MONGO_URI=mongodb://localhost:27017/resume-analyzer

# Frontend .env
REACT_APP_API_URL=http://localhost:5000
```

### Best Practices for Production
1. **Use HttpOnly Cookies** instead of localStorage for tokens
2. **Enable HTTPS** only
3. **Use strong JWT_SECRET** (32+ random characters)
4. **Implement token refresh** mechanism
5. **Add rate limiting** on auth endpoints
6. **Add email verification** for registration
7. **Implement password reset** functionality
8. **Add two-factor authentication** (2FA)

## 🧪 Testing Authentication

### Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Protected Endpoint
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer {token}"
```

## 📋 Checklist

- [x] User registration with validation
- [x] Secure password hashing
- [x] JWT token generation
- [x] Login with email & password
- [x] Protected routes on frontend
- [x] Auth middleware on backend
- [x] Auto-login on app load
- [x] Auto-logout on token expiration
- [x] Logout functionality
- [x] Auth context for state management
- [x] API interceptors for automatic token addition
- [x] Error handling and validation

## 🚀 Future Enhancements

- [ ] Email verification on registration
- [ ] Password reset via email
- [ ] OAuth integration (Google, GitHub)
- [ ] Two-factor authentication (2FA)
- [ ] Session management
- [ ] Remember me functionality
- [ ] Account recovery
- [ ] Rate limiting on auth endpoints
- [ ] Login activity tracking

## 📚 Related Files

- Frontend Auth Context: [AuthContext.js](frontend/src/context/AuthContext.js)
- Frontend Protected Route: [ProtectedRoute.js](frontend/src/components/ProtectedRoute.js)
- Backend Auth Routes: [auth.js](backend/routes/auth.js)
- Backend Auth Middleware: [middleware/auth.js](backend/middleware/auth.js)
- Backend User Model: [models/User.js](backend/models/User.js)
