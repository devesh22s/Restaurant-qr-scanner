import jwt from 'jsonwebtoken';
import myModel from '../model/User.js';
import Session from '../model/Session.js';

const identifyUser = async (req, res, next) => {
  try {
    req.identity = { type: 'guest', id: null }; // Default

    // ============================================================
    // 1. JWT Check (Registered User / Admin)
    // ============================================================
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1];
      
      try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "0ba6a542a7b643cb19b58ee54ee53f2063c99b59b14ecb21a2ba48f0e7de5d39");
        const user = await myModel.findById(decoded.id).select('-passwordHash');
        
        if (user) {
          req.user = user;
          req.identity = { type: 'user', id: user._id };
          return next(); 
        }
      } catch (err) {
        // 🚨 CRITICAL FIX: Token Expired hai to Guest mat banao. 
        // 401 return karo taaki Frontend Logout process shuru kare.
        return res.status(401).json({ message: "Token Expired", code: "TOKEN_EXPIRED" });
      }
    }

    // ============================================================
    // 2. Session Check (Guest User)
    // ============================================================
    const sessionToken = req.headers['x-session-token'] || req.body?.sessionToken;

    if (sessionToken) {
      const session = await Session.findOne({ sessionToken });
      
      // Agar session DB me hai ya naya hai, use Session Identity do
      req.identity = { type: 'session', id: sessionToken };
      
      if (session) {
         req.sessionData = session;
      }
    }

    next();
  } catch (error) {
    console.error("Middleware Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export default identifyUser;