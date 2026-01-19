import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import dbconnect from './config/database.js';

// Models (Import all to ensure registration)
import './model/User.js';
import './model/menu.js';
import './model/cart.js';
import './model/coupon.js';
import './model/table.js';
import './model/Session.js';
import './model/order.js';

// Routes
import authRouter from './routes/auth.router.js';
import tableRouter from './routes/table.route.js';
import sessionRouter from './routes/session.route.js';
import menuRouter from './routes/menu.route.js';
import cartRouter from './routes/cart.route.js';
import couponRouter from './routes/coupoun.route.js'; // Spelling file name mein check karna
import orderRouter from './routes/order.route.js';

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || ["http://localhost:5173"],
  credentials: true
}));

// DB Connection
dbconnect();

// Routes Mapping
const apiPrefix = "/api/v1"; // Better versioning
app.use(`${apiPrefix}/auth`, authRouter);
app.use(`${apiPrefix}/tables`, tableRouter); // Separate logical routes
app.use(`${apiPrefix}/session`, sessionRouter);
app.use(`${apiPrefix}/menu`, menuRouter);
app.use(`${apiPrefix}/cart`, cartRouter);
app.use(`${apiPrefix}/coupons`, couponRouter);
app.use(`${apiPrefix}/orders`, orderRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});