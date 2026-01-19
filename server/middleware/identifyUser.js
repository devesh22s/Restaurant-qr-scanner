import jwt from 'jsonwebtoken';
import myModel from '../model/User.js';
import Session from '../model/Session.js';

const identifyUser = async (req, res, next) => {
  try {
    req.identity = { type: 'guest', id: null }; // Default

    // 1. Check for JWT (Registered User)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "0ba6a542a7b643cb19b58ee54ee53f2063c99b59b14ecb21a2ba48f0e7de5d39");
        const user = await myModel.findById(decoded.id).select('-passwordHash');
        if (user) {
          req.user = user;
          req.identity = { type: 'user', id: user._id };
          return next(); // User found, proceed
        }
      } catch (err) {
        console.log("Invalid Token, checking for session...");
      }
    }

    // 2. Check for Session Token (Guest) - Comes in headers usually
    const sessionToken = req.headers['x-session-token'] || req.body.sessionToken;
    
    if (sessionToken) {
      const session = await Session.findOne({ sessionToken });
      if (session) {
        // Check expiry
        if (new Date() > session.expiresAt) {
           // Expired session logic handled by frontend usually
           console.log("Session expired");
        } else {
            req.sessionData = session;
            req.identity = { type: 'session', id: sessionToken };
        }
      }
    }

    next();
  } catch (error) {
    console.error("Middleware Error:", error);
    next(); // Proceed as anonymous if error
  }
};

export default identifyUser;