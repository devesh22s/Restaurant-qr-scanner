import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http'; 
import { Server } from 'socket.io'; 
import helmet from 'helmet'; 
import dbconnect from './config/database.js';

// Models & Routes imports...
import './model/User.js';
import './model/menu.js';
import './model/cart.js';
import './model/coupon.js';
import './model/table.js';
import './model/Session.js';
import './model/order.js';

import authRouter from './routes/auth.router.js';
import tableRouter from './routes/table.route.js';
import sessionRouter from './routes/session.route.js';
import menuRouter from './routes/menu.route.js';
import cartRouter from './routes/cart.route.js';
import couponRouter from './routes/coupoun.route.js'; 
import orderRouter from './routes/order.route.js';

dotenv.config();
const app = express();
const server = http.createServer(app); 

// ✅ 1. CORS Sabse Pehle
app.use(cors({
  origin: [
    'https://restaurant-qr-scanner.vercel.app', 
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "x-session-token"]
}));

// ✅ 2. Helmet (CORS ke baad)
app.use(helmet()); 
app.use(express.json());

dbconnect();

const io = new Server(server, {
  cors: {
    origin: ['https://restaurant-qr-scanner.vercel.app' , "http://localhost:5173"],
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("disconnect", () => console.log("Client disconnected"));
});

app.set('io', io);

const apiPrefix = "/api/v1"; 
app.use(`${apiPrefix}/auth`, authRouter);
app.use(`${apiPrefix}/tables`, tableRouter);
app.use(`${apiPrefix}/session`, sessionRouter);
app.use(`${apiPrefix}/menu`, menuRouter);
app.use(`${apiPrefix}/cart`, cartRouter);
app.use(`${apiPrefix}/coupons`, couponRouter);
app.use(`${apiPrefix}/orders`, orderRouter);

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});