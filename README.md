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
