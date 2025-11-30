# 🛒 MERN Stack E-Commerce Website

A full-stack e-commerce application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## ✨ Features

### Customer Features
- 🔐 User authentication (Register/Login)
- 🛍️ Browse products by category, gender, and collections
- 🔍 Search and filter products
- 🛒 Shopping cart with guest cart support
- 💳 Checkout process
- 📦 Order tracking and history

### Admin Features
- 📊 Admin dashboard
- 📦 Product management (CRUD)
- 👥 User management
- 📋 Order management

## 🛠️ Tech Stack

| Frontend | Backend |
|----------|---------|
| React 19 | Node.js |
| Redux Toolkit | Express.js |
| React Router | MongoDB |
| Tailwind CSS | JWT Auth |
| Vite | Cloudinary |

## 📁 Project Structure

```
├── backend/
│   ├── config/         # Database & Cloudinary config
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   └── utils/          # Utility functions
│
├── frontend/
│   └── src/
│       ├── components/ # React components
│       ├── pages/      # Page components
│       └── redux/      # Redux store & slices
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend && npm install
   
   # Frontend
   cd frontend && npm install
   ```

3. **Set up environment variables**

   Create `backend/.env`:
   ```env
   PORT=7000
   MONGO_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_secret_key
   JWT_EXPIRE=30d
   FRONTEND_URL=http://localhost:5173
   ```

   Create `frontend/.env`:
   ```env
   VITE_BACKEND_URL=http://localhost:7000
   ```

4. **Seed the database**
   ```bash
   cd backend && node seeder.js
   ```

5. **Run the application**
   ```bash
   # Backend
   cd backend && npm run dev
   
   # Frontend
   cd frontend && npm run dev
   ```

6. **Access the app**
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:7000`

### Default Admin Login
```
Email: admin@example.com
Password: 1234567890
```

## 📜 License

MIT License