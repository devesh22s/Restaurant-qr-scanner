import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // ✅ Essential Import
import { generatAccessToken, generatRefershToken } from "../utils/jwt.js";
import transporter from "../services/emailServices.js";
import registerTemplate from "../services/templates/registerTemplate.js";
import myModel from '../model/User.js'; 
import admin from "../config/firebaseAdmin.js";
// ==========================================
// 1. REGISTER
// ==========================================
export const register = async (req, res) => {
    try {
        const { name, email, password, contact } = req.body;

        const userData = await myModel.findOne({ email });
        if (userData) {
            return res.status(400).json({
                message: "User already registered, please login"
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const newUser = await myModel.create({
            name,
            email,
            contact,
            passwordHash
        });

        // Send Email
        try {
            await transporter.sendMail({
                from: 'SavouryBites <devesh262004@gmail.com>',
                to: newUser.email,
                subject: "Welcome to SavouryBites! 🎉",
                html: registerTemplate(newUser.name, "SavouryBites"), 
            });
        } catch (err) {
            console.log("Email Error:", err.message);
        }

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: newUser
        });

    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 2. LOGIN
// ==========================================
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await myModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found, please Register" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const accessToken = generatAccessToken({ 
            name: user.name, 
            email: user.email, 
            role: user.role, 
            id: user._id 
        });
        
        const refreshToken = generatRefershToken({ 
            name: user.name, 
            email: user.email, 
            role: user.role, 
            id: user._id 
        });

        user.refreshToken = refreshToken;
        user.refreshTokenExpireTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        user.lastlogin = Date.now();
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            data: user,
            accessToken,
            refreshToken
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 3. SEARCH ACCOUNT
// ==========================================
export const searchAccount = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await myModel.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'No account found' });
        }
        
        return res.status(200).json({
            success: true,
            message: "Account found",
            data: user,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 4. REFRESH TOKEN
// ==========================================
export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token provided" });
        }
// Verify Token
        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        } catch (e) {
             // Agar Verify fail hua (Expired), to 403 do -> Frontend Logout karega
            return res.status(403).json({ message: "Refresh token expired" });
        }
        const user = await myModel.findById(decoded.id);
        
        // Database match check
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }
// Generate NEW Access Token
        const newAccessToken = generatAccessToken({ 
            name: user.name, 
            email: user.email, 
            role: user.role, 
            id: user._id 
        });

        return res.status(200).json({
            success: true,
            accessToken: newAccessToken,
            user: user
        });

    } catch (error) {
        console.error("Refresh Token Error:", error);
        return res.status(403).json({ message: "Session expired, please login again" });
    }
};

// ==========================================
// 5. SEND OTP (Fixed & Debugged)
// ==========================================
export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await myModel.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save to DB
        user.resetPasswordToken = otp; 
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 Minutes
        
        await user.save();
        console.log(`OTP Generated & Saved for ${email}: ${otp}`); // ✅ Debug Log

        // Send Email
        await transporter.sendMail({
            from: 'SavouryBites <devesh262004@gmail.com>',
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is: ${otp}. It expires in 10 minutes.`
        });

        res.status(200).json({ success: true, message: "OTP sent to email" });

    } catch (error) {
        console.error("Send OTP Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 6. RESET PASSWORD (Fixed & Debugged)
// ==========================================
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        
        console.log("Reset Request Received:", { email, otp }); // ✅ Debug Log 1

        // 1. Find User by Email first (Debugging ke liye)
        const userCheck = await myModel.findOne({ email });
        if(userCheck) {
            console.log("DB OTP:", userCheck.resetPasswordToken); // ✅ Debug Log 2
            console.log("DB Expiry:", userCheck.resetPasswordExpires);
            console.log("Current Time:", new Date());
        }

        // 2. Strict Check
        const user = await myModel.findOne({ 
            email, 
            resetPasswordToken: otp,
            resetPasswordExpires: { $gt: Date.now() } 
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or Expired OTP" });
        }

        // 3. Update Password
        const passwordHash = await bcrypt.hash(newPassword, 12);
        
        user.passwordHash = passwordHash;
        user.resetPasswordToken = undefined; // Clear OTP
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ success: true, message: "Password reset successful" });

    } catch (error) {
        console.error("Reset Error:", error);
        res.status(500).json({ message: error.message });
    }
};




// ==========================================
// 7. GOOGLE AUTH (New)
// ==========================================
export const googleAuth = async (req, res) => {
    try {
        const { idToken } = req.body;

        // 1. Verify Token with Firebase
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { email, name, uid, picture } = decodedToken;

        // 2. Check if user exists
        let user = await myModel.findOne({ email });

        if (user) {
            // LOGIN LOGIC
            const accessToken = generatAccessToken({ 
                name: user.name, email: user.email, role: user.role, id: user._id 
            });
            const refreshToken = generatRefershToken({ 
                name: user.name, email: user.email, role: user.role, id: user._id 
            });

            user.refreshToken = refreshToken;
            await user.save();

            return res.status(200).json({
                success: true,
                message: "Google Login Successful",
                data: user,
                accessToken,
                refreshToken
            });
        } else {
            // REGISTER LOGIC
            const newUser = await myModel.create({
                name: name,
                email: email,
                passwordHash: await bcrypt.hash(uid, 12), // Dummy password (UID)
                contact: "", // Contact baad me user update karega
                role: "customer",
                isVerified: true
            });

            const accessToken = generatAccessToken({ 
                name: newUser.name, email: newUser.email, role: newUser.role, id: newUser._id 
            });
            const refreshToken = generatRefershToken({ 
                name: newUser.name, email: newUser.email, role: newUser.role, id: newUser._id 
            });

            newUser.refreshToken = refreshToken;
            await newUser.save();

            return res.status(201).json({
                success: true,
                message: "Account Created via Google",
                data: newUser,
                accessToken,
                refreshToken
            });
        }
    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(401).json({ success: false, message: "Invalid Google Token" });
    }
};