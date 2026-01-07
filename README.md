# ECommerce Backend

An end-to-end e-commerce website backend built with Node.js, Express, and MongoDB.

## 🚀 Features

- **User Authentication & Authorization**: Secure user registration and login with JWT tokens
- **Product Management**: CRUD operations for products
- **Shopping Cart**: Add, update, and remove items from cart
- **Checkout Process**: Complete checkout flow for orders
- **Order Management**: Track and manage customer orders
- **Payment Integration**: Handle payment processing
- **Security**: Password hashing with bcrypt, cookie-based authentication
- **CORS Support**: Cross-origin resource sharing enabled
- **Scheduled Tasks**: Automated tasks with node-cron

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Environment Variables**: dotenv
- **Task Scheduling**: node-cron

## 📁 Project Structure

```
ECommerce-Backend/
├── src/
│   ├── app.js              # Express app configuration
│   ├── server.js           # Server entry point
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   └── utils/              # Utility functions
├── .gitignore
├── package.json
└── package-lock.json
```

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/javin1106/ECommerce-Backend.git
   cd ECommerce-Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   CORS_ORIGIN=http://localhost:3000
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000` (or your specified PORT).

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove item from cart

### Checkout
- `POST /api/checkout` - Process checkout

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order

### Payment
- `POST /api/payment` - Process payment

## 🔒 Security Features

- Password encryption using bcrypt
- JWT-based authentication
- HTTP-only cookies for token storage
- CORS protection
- Environment variable configuration

## 📦 Dependencies

### Production
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `bcrypt`: Password hashing
- `jsonwebtoken`: JWT authentication
- `cookie-parser`: Parse cookies
- `cors`: Enable CORS
- `dotenv`: Environment variables
- `node-cron`: Task scheduling

### Development
- `nodemon`: Auto-restart server on changes

## 🧪 Scripts

```bash
npm run dev    # Start development server with nodemon
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the ISC License.

## 👤 Author

**javin1106**
- GitHub: [@javin1106](https://github.com/javin1106)

## 📧 Support

For support, please open an issue in the GitHub repository.

---

⭐ If you find this project helpful, please consider giving it a star!