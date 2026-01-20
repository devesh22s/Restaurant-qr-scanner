import bcrypt from 'bcrypt';
import { generatAccessToken, generatRefershToken } from "../utils/jwt.js";
import transporter from "../services/emailServices.js";
import registerTemplate from "../services/templates/registerTemplate.js";
import myModel from '../model/User.js'; // Fixed: Uncommented and ensured correct path (Check User.js capitalization)

// Register Controller
export const register = async (req, res) => {
    try {
        const { name, email, password, contact } = req.body;

        // 1. Check existing user
        const userData = await myModel.findOne({ email });
        if (userData) {
            return res.status(400).json({
                message: "User already registered, please login"
            });
        }

        // 2. Hash Password
        const passwordHash = await bcrypt.hash(password, 12);

        // 3. Create User
        const newUser = await myModel.create({
            name,
            email,
            contact,
            passwordHash
        });

        // 4. Send Email (Safe Mode - Won't crash if email fails)
        try {
            const info = await transporter.sendMail({
                from: 'SavouryBites <devesh262004@gmail.com>',
                to: newUser.email,
                subject: "Welcome to SavouryBites! 🎉",
                text: registerTemplate(newUser.name, "SavouryBites"),
            });
            console.log("Email sent successfully:", info.messageId);
        } catch (emailError) {
            console.error("Email sending failed:", emailError.message);
            // Registration continue rahega
        }

        // 5. Success Response
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: newUser
        });

    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

// Login Controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await myModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found, please Register" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid Credentials" 
            });
        }

        // Generate Tokens
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

        // Update DB
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
        return res.status(500).json({
            message: error.message
        });
    }
};

// Search Account Controller
export const searchAccount = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await myModel.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: 'No account found' });
        }
        
        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};