import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
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

dotenv.config();
const app = express();

// ✅ Fix 1: Manual OPTIONS handler - SABSE PEHLE
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://restaurant-qr-scanner.vercel.app');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://restaurant-qr-scanner.vercel.app',
      'http://localhost:5173'
    ];
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
app.options('*', cors(corsOptions)); // ✅ Fix 2: * use karo

// DB Connection
dbconnect();

// ✅ Fix 3: Socket.io sirf local mein, Vercel pe nahi
const isVercel = process.env.VERCEL === '1';
let io = null;

if (!isVercel) {
  const { createServer } = await import('http');
  const { Server } = await import('socket.io');
  const server = createServer(app);

  io = new Server(server, {
    cors: {
      origin: ['https://restaurant-qr-scanner.vercel.app', 'http://localhost:5173'],
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('disconnect', () => console.log('Client disconnected'));
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
}

app.set('io', io);

// Routes
const apiPrefix = '/api/v1';
app.use(`${apiPrefix}/auth`, authRouter);
app.use(`${apiPrefix}/tables`, tableRouter);
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
    message: err.message || 'Internal Server Error'
  });
});

// ✅ Fix 4: Vercel ke liye export zaroori hai
export default app;