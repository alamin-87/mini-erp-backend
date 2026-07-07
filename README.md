# Mini ERP - Backend

A robust, scalable backend architecture for the Mini ERP application, providing secure data management, role-based access control, and dynamic reporting.

## 🚀 Tech Stack

- **Framework**: [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/) ORM
- **Validation**: [Zod](https://zod.dev/) for strict schema validation
- **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/) & [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- **File Uploads**: [Multer](https://github.com/expressjs/multer) & [Cloudinary](https://cloudinary.com/) API

## ✨ Key Features

- **Secure Authentication & RBAC**:
  - Encrypted passwords and secure JWT issuance.
  - Three predefined roles: `admin`, `manager`, and `employee`.
  - Granular permission logic enforcing strict route-level security.
- **Advanced Query Builder**:
  - Dynamically builds MongoDB queries to support searching, filtering, and pagination out-of-the-box for all REST endpoints.
- **Product & Inventory Management**:
  - Full CRUD capabilities.
  - Secure image uploads seamlessly integrated with Cloudinary.
  - Soft-delete pattern implemented for data safety.
- **Sales Engine**:
  - Track complete sales records with auto-calculated grand totals.
  - Inventory validation prevents out-of-stock purchases.
  - Atomically deducts inventory stock using Mongoose transactions/sessions.
- **Dashboard Analytics**:
  - Aggregation pipelines efficiently compute key metrics such as Total Products, Total Sales, and Low Stock Alerts.

## 📁 Project Structure

```text
src/
├── config/        # Environment configurations (DB, Cloudinary, etc.)
├── ErrorHelper/   # Custom Error classes and global error handling
├── interfaces/    # Global Typescript interfaces and constants
├── middlewares/   # Auth Guards, Zod Request Validators
├── models/        # Mongoose Models, Controllers, Services, Validations, and Routes
│   ├── auth/
│   ├── Product/
│   ├── Sales/
│   ├── stats/
│   └── users/
├── shared/        # Reusable utility functions (catchAsync, sendResponse)
├── utils/         # Query Builders and helper functions
├── app.ts         # Express App configuration
└── server.ts      # Server bootstrap and database connection
```

## 🛠️ Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone <your-backend-repo-url>
   cd mini-erp-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=5000
   DATABASE_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/minierp
   BCRYPT_SALT_ROUNDS=12
   JWT_ACCESS_SECRET=your_super_secret_jwt_key
   JWT_ACCESS_EXPIRES_IN=1d

   # Cloudinary credentials for product image uploads
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Run the Development Server**:
   Using `ts-node-dev` for rapid restarts:
   ```bash
   npm run dev
   ```

## 📦 Building for Production

Compile TypeScript down to JavaScript:

```bash
npm run build
```

Then start the production server:

```bash
npm start
```

## 🛡️ Error Handling

The application features a centralized error-handling middleware that intercepts standard Errors, Zod validation errors, and MongoDB-specific errors, transforming them into a consistent JSON response format for the frontend client.

---

# API Documentation

## Base URL
`http://localhost:<PORT>/api/v1` (adjust the port and version as per your `app.ts` setup)

## Authentication
Most endpoints require a Bearer token in the `Authorization` header.
```http
Authorization: Bearer <your_jwt_token>
```

---

## 1. Authentication
**Base Path:** `/auth`

### Register a User
- **URL**: `/auth/register`
- **Method**: `POST`
- **Body**: 
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

### Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Body**: 
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

### Get Current User (Me)
- **URL**: `/auth/me`
- **Method**: `GET`
- **Headers**: Requires Authentication

---

## 2. Products
**Base Path:** `/products`
- **Access**: View access for Employee, Manager, Admin. Manage access for Manager, Admin.

### Get All Products
- **URL**: `/products`
- **Method**: `GET`
- **Headers**: Requires Authentication

### Get Product by ID
- **URL**: `/products/:id`
- **Method**: `GET`
- **Headers**: Requires Authentication

### Create Product
- **URL**: `/products`
- **Method**: `POST`
- **Headers**: Requires Authentication (Admin/Manager)
- **Content-Type**: `multipart/form-data`
- **Form Data**: Supports `productImage` file upload along with product details.

### Update Product
- **URL**: `/products/:id`
- **Method**: `PATCH`
- **Headers**: Requires Authentication (Admin/Manager)
- **Content-Type**: `multipart/form-data`
- **Form Data**: Supports `productImage` file upload along with product details.

### Delete Product
- **URL**: `/products/:id`
- **Method**: `DELETE`
- **Headers**: Requires Authentication (Admin/Manager)

---

## 3. Sales
**Base Path:** `/sales`
- **Access**: Create access for all roles. View access for Manager, Admin.

### Create Sale
- **URL**: `/sales`
- **Method**: `POST`
- **Headers**: Requires Authentication

### Get All Sales
- **URL**: `/sales`
- **Method**: `GET`
- **Headers**: Requires Authentication (Admin/Manager)

### Get Sale by ID
- **URL**: `/sales/:id`
- **Method**: `GET`
- **Headers**: Requires Authentication (Admin/Manager)

---

## 4. Dashboard Stats
**Base Path:** `/dashboard`

### Get Dashboard Statistics
- **URL**: `/dashboard`
- **Method**: `GET`
- **Headers**: Requires Authentication

---

## 5. Users
**Base Path:** `/user` (also mapped to `/users`)

### Get Current User Profile
- **URL**: `/user/me`
- **Method**: `GET`
- **Headers**: Requires Authentication

### Get User by ID
- **URL**: `/user/:id`
- **Method**: `GET`
- **Headers**: Requires Authentication

### Update Current User Profile
- **URL**: `/user/me`
- **Method**: `PATCH`
- **Headers**: Requires Authentication
- **Content-Type**: `multipart/form-data`
- **Form Data**: Supports `profilePhoto` file upload.

### Delete Current User Profile
- **URL**: `/user/me`
- **Method**: `DELETE`
- **Headers**: Requires Authentication
