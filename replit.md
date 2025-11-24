# THE RAS E-Commerce Application

## Overview
A full-stack e-commerce web application built with Node.js, Express, MongoDB, and vanilla JavaScript. Users can browse products, add items to cart, and checkout. Admins can manage the product catalog through an admin panel.

## Recent Changes (November 24, 2024)
- Fixed JWT_SECRET security issue by removing hardcoded fallback values
- Fixed route order bug in products.js (categories route now comes before :id route)
- Created missing HTML pages: login.html, signup.html, checkout.html, admin.html
- Set up environment variables with secure JWT_SECRET
- Added .gitignore and .env.example files
- Configured workflow to run the server on port 5000
- Removed deprecated MongoDB connection options

## Project Architecture

### Backend (Node.js/Express)
- **server/server.js**: Main server entry point
- **server/models/**: MongoDB schemas (User, Product)
- **server/routes/**: API routes (auth, products)
- **server/middleware/**: Authentication middleware

### Frontend (HTML/CSS/JavaScript)
- **public/index.html**: Homepage with featured products
- **public/products.html**: Product catalog with filters and search
- **public/product-detail.html**: Individual product page
- **public/cart.html**: Shopping cart
- **public/checkout.html**: Checkout page
- **public/login.html**: User login
- **public/signup.html**: User registration
- **public/admin.html**: Admin panel for product management
- **public/css/style.css**: Main stylesheet
- **public/js/api.js**: API helper functions
- **public/js/cart.js**: Cart management with localStorage

## Key Features
1. **User Authentication**: JWT-based signup and login
2. **Product Catalog**: Browse, filter, and search products
3. **Shopping Cart**: Add/remove items, managed with localStorage
4. **Checkout**: Demo checkout flow with shipping/payment forms
5. **Admin Panel**: Admin-only product CRUD operations
6. **Responsive Design**: Mobile-friendly UI

## Environment Variables
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `PORT`: Server port (default: 5000)

## User Roles
- **User**: Can browse products, add to cart, and checkout
- **Admin**: Has all user permissions plus product management access

## Database
Uses MongoDB with Mongoose ODM. Collections:
- **users**: User accounts with hashed passwords
- **products**: Product catalog with title, description, price, category, stock, image

## Technology Stack
- **Backend**: Node.js, Express, MongoDB/Mongoose, JWT, bcrypt
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Deployment**: Replit (Port 5000)

## Getting Started
1. Set environment variables (see .env.example)
2. Install dependencies: `npm install`
3. Run server: `npm start` or `node server/server.js`
4. Access at http://localhost:5000

## Admin Access
To create an admin user, you'll need to manually update a user's role in the database from 'user' to 'admin'.
