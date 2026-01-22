import jwt from 'jsonwebtoken';
import myModel from '../model/User.js';

const verify = async (req, res, next) => {
    try {
        // 1. Check Header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: "Access Denied. No token provided." });
        }

        // 2. Extract Token
        const token = authHeader.split(' ')[1];

        // 3. Verify Token
        const decoded = jwt.verify(
            token, 
            process.env.JWT_SECRET || "0ba6a542a7b643cb19b58ee54ee53f2063c99b59b14ecb21a2ba48f0e7de5d39"
        );

        // 4. Get User from DB
        const userData = await myModel.findById(decoded.id).select('-passwordHash');
        
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        req.user = userData;
        next();

    } catch (error) {
        // ✅ HANDLE EXPIRATION CORRECTLY
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ 
                success: false, 
                message: "Session Expired. Please Login Again." 
            });
        }
        
        if (error.name === "JsonWebTokenError") {
            return res.status(403).json({ 
                success: false, 
                message: "Invalid Token." 
            });
        }

        // Real Server Error
        res.status(500).json({ success: false, message: error.message });
    }
};

export default verify;