import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http'; 
import { Server } from 'socket.io'; 
// import helmet from 'helmet'; // Disabled temporarily for Google Auth popup testing
import dbconnect from './config/database.js';

// Models
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
import couponRouter from './routes/coupoun.route.js'; 
import orderRouter from './routes/order.route.js';
// import dashRouter from './routes/dashboard.router.js';

dotenv.config();
const app = express();
const server = http.createServer(app); 

// Middleware
app.use(express.json());

// CORS Setup
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://restaurant-qr-scanner.vercel.app',
      'http://localhost:5173'
    ];
    // Allow requests with no origin (mobile apps, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));

// ✅ THE MAIN FIX: Changed '*' to '/(.*)' to prevent Vercel/Express regex crash
app.options('/(.*)', cors(corsOptions));

// DB Connection
dbconnect();

// Socket.io Setup (For Kitchen Updates)
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

// Make 'io' accessible in Controllers
app.set('io', io);

// Routes Mapping
const apiPrefix = "/api/v1"; 
app.use(`${apiPrefix}/auth`, authRouter);
app.use(`${apiPrefix}/tables`, tableRouter);
app.use(`${apiPrefix}/session`, sessionRouter);
app.use(`${apiPrefix}/menu`, menuRouter);
app.use(`${apiPrefix}/cart`, cartRouter);
app.use(`${apiPrefix}/coupons`, couponRouter);
app.use(`${apiPrefix}/orders`, orderRouter);
// app.use(`${apiPrefix}/dashboard`, dashRouter);

// Global Error Handler
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