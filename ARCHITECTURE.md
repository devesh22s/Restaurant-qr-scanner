# 🏗️ Restaurant QR Scanner - Complete Architecture Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Backend Architecture](#backend-architecture)
4. [Frontend Architecture](#frontend-architecture)
5. [Data Flow](#data-flow)
6. [Authentication & Authorization](#authentication--authorization)
7. [Database Schema](#database-schema)
8. [API Endpoints](#api-endpoints)
9. [Key Features & Workflows](#key-features--workflows)

---

## 🎯 Project Overview

This is a **full-stack Restaurant QR Scanner application** built with the MERN stack (MongoDB, Express, React, Node.js). The system allows customers to scan QR codes on restaurant tables to view digital menus, add items to cart, and place orders. It supports both registered users and guest users.

### Tech Stack
- **Frontend**: React 19, Redux Toolkit, React Router, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Authentication**: JWT (Access & Refresh Tokens)
- **File Storage**: Cloudinary (for menu images)
- **QR Code Generation**: QRCode library
- **Deployment**: Vercel

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (React Frontend)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Pages   │  │Components│  │  Redux   │  │  Router  │   │
│  │          │  │          │  │  Store   │  │          │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST API
                       │ (CORS Enabled)
┌──────────────────────▼──────────────────────────────────────┐
│              SERVER (Express Backend)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Routes  │  │Controller│  │Middleware│  │   Utils   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
┌───────▼──────┐ ┌─────▼──────┐ ┌─────▼──────┐
│   MongoDB    │ │ Cloudinary │ │   JWT      │
│  Database    │ │   Storage  │ │  Tokens    │
└──────────────┘ └────────────┘ └────────────┘
```

---

## 🔧 Backend Architecture

### Directory Structure
```
server/
├── config/              # Configuration files
│   ├── database.js      # MongoDB connection
│   └── cloudinary.js    # Cloudinary setup
├── controller/          # Business logic
│   ├── authController.js
│   ├── menuController.js
│   ├── cartController.js
│   ├── sessionController.js
│   └── tableController.js
├── middleware/          # Request processing
│   ├── verify.js        # JWT verification
│   ├── checkRole.js     # Role-based access control
│   └── upload.js        # Multer file upload
├── model/               # Mongoose schemas
│   ├── User.js
│   ├── menu.js
│   ├── cart.js
│   ├── Session.js
│   └── table.js
├── routes/              # API route definitions
│   ├── auth.router.js
│   ├── menu.route.js
│   ├── cart.route.js
│   ├── session.route.js
│   ├── table.route.js
│   └── user.route.js
├── utils/               # Helper functions
│   ├── jwt.js           # Token generation
│   └── SuccessResponse.js
├── uploads/             # Temporary file storage
├── seeders/             # Database seeders
└── index.js             # Entry point
```

### Request Flow
```
Client Request
    ↓
Express App (index.js)
    ↓
CORS Middleware
    ↓
JSON Parser
    ↓
Route Handler (routes/*.js)
    ↓
Middleware Chain:
  - verify.js (JWT check)
  - checkRole.js (Role check)
  - upload.js (File upload, if needed)
    ↓
Controller (controller/*.js)
    ↓
Model/Database Operations
    ↓
Response to Client
```

### Key Backend Components

#### 1. **Entry Point (index.js)**
- Initializes Express app
- Connects to MongoDB
- Configures CORS (allows localhost:5173 and Vercel domain)
- Sets up global error handler
- Mounts all route handlers under `/api/auth`

#### 2. **Authentication System**
- **JWT-based**: Uses access tokens (1hr) and refresh tokens (7 days)
- **Password Hashing**: bcrypt with salt rounds of 12
- **Token Storage**: Refresh tokens stored in User model
- **Middleware Chain**: `verify.js` → `checkRole.js`

#### 3. **File Upload System**
- **Multer**: Handles multipart/form-data
- **Storage**: Local `uploads/` directory (temporary)
- **Cloudinary**: Uploads images to cloud storage
- **Flow**: Upload → Local storage → Cloudinary → Delete local → Save URL to DB

---

## 🎨 Frontend Architecture

### Directory Structure
```
client/
├── src/
│   ├── Component/           # Reusable components
│   │   ├── AuthenticatedLayout.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Home.jsx
│   │   ├── Protectedroute.jsx
│   │   ├── OpenRoutes.jsx
│   │   └── ...
│   ├── pages/               # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Welcome.jsx
│   ├── redux/               # State management
│   │   ├── store.jsx
│   │   ├── authSlice.jsx
│   │   ├── menuSlice.jsx
│   │   └── guestSlice.jsx
│   ├── context/             # React Context
│   │   └── ToastContext.jsx
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
```

### State Management (Redux)
- **authSlice**: User authentication state, tokens, role
- **menuSlice**: Menu items, categories, filters
- **guestSlice**: Guest session tokens

### Routing System
- **Protected Routes**: Require authentication (access token)
- **Open Routes**: Redirect if already authenticated
- **Public Routes**: Welcome page (QR code entry point)

---

## 🔄 Data Flow

### 1. **User Registration Flow**
```
User fills form → POST /api/auth/register
    ↓
authController.register()
    ↓
Check if email exists
    ↓
Hash password (bcrypt)
    ↓
Create user in MongoDB
    ↓
Return success response
```

### 2. **User Login Flow**
```
User submits credentials → POST /api/auth/login
    ↓
authController.login()
    ↓
Find user by email
    ↓
Verify password (bcrypt.compare)
    ↓
Generate JWT tokens (access + refresh)
    ↓
Save refresh token to user document
    ↓
Return tokens + user data
    ↓
Frontend stores tokens in localStorage
```

### 3. **QR Code Session Flow**
```
Customer scans QR → Extracts qrSlug from URL
    ↓
POST /api/auth/session {deviceId, qrslug}
    ↓
sessionController()
    ↓
Find table by qrSlug
    ↓
Generate session token (crypto.randomBytes)
    ↓
Create session document (expires in 24hrs)
    ↓
Return session token
    ↓
Frontend stores session token
```

### 4. **Menu Display Flow**
```
GET /api/auth/menu?category=...
    ↓
menuController.getmenuCategory()
    ↓
Query MongoDB (filter by category & availability)
    ↓
Return menu items
    ↓
Frontend Redux updates menuSlice
    ↓
Components render menu items
```

### 5. **Cart Management Flow**
```
Add to Cart:
  POST /api/auth/addtocart {userId, menuItemId, quantity}
    ↓
  cartController.addToCart()
    ↓
  Find or create cart for user
    ↓
  Check if item exists in cart
    ↓
  Add/update item quantity
    ↓
  Calculate total price
    ↓
  Save cart

Increase/Decrease:
  PATCH /api/auth/cart/increase?userId=...&menuItemId=...
    ↓
  Update quantity
    ↓
  Recalculate total
```

### 6. **Table & QR Generation Flow**
```
Admin creates table → POST /api/auth/tables
    ↓
tableController.createTable()
    ↓
Generate qrSlug (crypto.randomBytes)
    ↓
Create QR code URL (localhost:5173/welcome?qr=...)
    ↓
Generate QR code image (QRCode.toDataURL)
    ↓
Save table document with QR data
    ↓
Return table data (includes QR image)
```

---

## 🔐 Authentication & Authorization

### Authentication Middleware (`verify.js`)
1. Extracts token from `Authorization: Bearer <token>` header
2. Verifies JWT signature
3. Decodes token to get user ID
4. Fetches user from database
5. Attaches user object to `req.user`
6. Calls `next()` to continue

### Authorization Middleware (`checkRole.js`)
1. Receives allowed roles array (e.g., `['admin', 'customer']`)
2. Checks `req.user.role` against allowed roles
3. Allows or denies access (403 if denied)

### Protected Endpoints
- **Admin Only**: `/api/auth/tables` (GET all tables)
- **Customer/Admin**: `/menu` (GET menu items)
- **Public**: `/api/auth/session`, `/api/auth/menu` (GET)

---

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (required, unique),
  passwordHash: String (required, hashed),
  contact: Number,
  accountTypes: 'REGISTERED' | 'GUEST',
  isActive: Boolean,
  role: 'customer' | 'admin' (default: 'customer'),
  totalSpend: Number,
  totalOrders: Number,
  loyalityPoint: Number (default: 0),
  refreshToken: String,
  refreshTokenExpireTime: Date,
  lastlogin: Date
}
```

### Menu Model
```javascript
{
  name: String,
  descripition: String,
  image: String (Cloudinary URL),
  isAvailabel: Boolean (default: true),
  price: Number,
  category: String
}
```

### Cart Model
```javascript
{
  userId: ObjectId (ref: 'User'),
  items: [{
    menuItemId: ObjectId (ref: 'Menu'),
    quantity: Number
  }],
  totalCartPrice: Number (calculated)
}
```

### Session Model
```javascript
{
  sessionToken: String (generated),
  deviceId: String (from client),
  userId: ObjectId (ref: 'User', optional),
  ip: String,
  userAgent: String,
  tableNumber: Number,
  qrCodeUrl: String,
  convertedSession: Boolean (default: false),
  expiresAt: Date (24hrs from creation),
  lastActivity: Date
}
```

### Table Model
```javascript
{
  tableNumber: Number (required),
  qrSlug: String (required, unique),
  qrCodeUrl: String (required),
  qrImage: String (base64 or URL),
  isActive: Boolean (default: true),
  capacity: Number
}
```

---

## 🌐 API Endpoints

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/register` | ❌ | - | Register new user |
| POST | `/login` | ❌ | - | Login user, get tokens |

### Menu Routes (`/api/auth`)
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/menu` | ❌ | - | Get menu items (filter by category) |
| POST | `/menu` | ✅ | Admin | Create menu item (with image) |
| PUT | `/menu/:id` | ✅ | Admin | Update menu item |
| DELETE | `/menu/:id` | ✅ | Admin | Delete menu item |

### Cart Routes (`/api/auth`)
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/addtocart` | ✅ | Customer | Add item to cart |
| DELETE | `/remove` | ✅ | Customer | Remove item from cart |
| PATCH | `/cart/increase` | ✅ | Customer | Increase item quantity |
| PATCH | `/cart/decrease` | ✅ | Customer | Decrease item quantity |

### Table Routes (`/api/auth`)
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/tables` | ❌ | - | Create table with QR code |
| GET | `/tables/:slug` | ❌ | - | Get table by QR slug |
| GET | `/tables` | ✅ | Admin | Get all tables |

### Session Routes (`/api/auth`)
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/session` | ❌ | - | Create guest session |

---

## 🎯 Key Features & Workflows

### 1. **QR Code-Based Menu Access**
- Each table has a unique QR code
- QR code contains: `http://localhost:5173/welcome?qr=<qrSlug>`
- Customer scans QR → redirected to Welcome page
- Welcome page extracts `qrSlug` from URL
- Creates session with device ID and table number
- Session token stored for guest access

### 2. **Dual User System**
- **Registered Users**: Full account, login required, cart persistence
- **Guest Users**: Session-based, no login, temporary cart

### 3. **Role-Based Access Control**
- **Customer**: Can view menu, manage cart
- **Admin**: Can manage menu, view all tables, access dashboard

### 4. **Image Management**
- Menu images uploaded via Multer
- Stored temporarily in `uploads/` folder
- Uploaded to Cloudinary
- Cloudinary URL saved to database
- Local file deleted after upload

### 5. **Cart System**
- One cart per user (userId-based)
- Items stored as array with menuItemId and quantity
- Total price calculated dynamically from menu prices
- Supports add, remove, increase, decrease operations

### 6. **Error Handling**
- Global error handler in `index.js`
- Catches all unhandled errors
- Returns standardized error responses
- Status codes: 400 (bad request), 403 (forbidden), 404 (not found), 500 (server error)

---

## 🔒 Security Features

1. **Password Security**: bcrypt hashing (12 salt rounds)
2. **JWT Tokens**: Signed with secret key, time-limited
3. **CORS**: Restricted to specific origins
4. **Role-Based Access**: Middleware checks user roles
5. **Token Verification**: Every protected route verifies JWT

---

## 🚀 Deployment Architecture

- **Frontend**: Vercel (static hosting)
- **Backend**: Vercel (serverless functions)
- **Database**: MongoDB Atlas (cloud)
- **File Storage**: Cloudinary (CDN)

### Environment Variables Required
```
# Server
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
PORT=3000

# Client
VITE_API_URL=http://localhost:3000 (or production URL)
```

---

## 📝 Notes & Future Enhancements

### Current Limitations
- JWT secret is hardcoded (should be in .env)
- No refresh token endpoint implemented
- Cart clearing endpoint exists but not fully utilized
- Session expiration not actively checked

### Potential Improvements
- Implement refresh token rotation
- Add order management system
- Real-time updates (WebSocket)
- Payment integration
- Analytics dashboard
- Email notifications
- Multi-restaurant support

---

## 🔍 How to Trace a Request

**Example: Adding item to cart**

1. **Frontend**: User clicks "Add to Cart" button
2. **Redux Action**: Dispatch async thunk (if implemented) or direct axios call
3. **HTTP Request**: `POST http://localhost:3000/api/auth/addtocart`
   - Headers: `Authorization: Bearer <accessToken>`
   - Body: `{userId, menuItemId, quantity}`
4. **Backend Route**: `cart.route.js` → `router.post('/addtocart', addToCart)`
5. **Middleware**: None (cart routes don't use verify/checkRole currently)
6. **Controller**: `cartController.addToCart()`
   - Find/create cart
   - Find menu item
   - Update cart items
   - Calculate total
   - Save to MongoDB
7. **Response**: `{message: 'Items added to cart successfully'}`
8. **Frontend**: Update UI, show success toast

---

This architecture document provides a complete overview of how the Restaurant QR Scanner application works. Each component is designed to handle specific responsibilities, following separation of concerns and RESTful API principles.

