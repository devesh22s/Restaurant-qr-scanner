import Table from "../model/table.js";
import QRCode from "qrcode";
import crypto from "crypto";

// 1. CREATE TABLE
export const createTable = async (req, res) => {
  try {
    const { tableNumber, capacity } = req.body;
    
    // Check if table exists
    const existingTable = await Table.findOne({ tableNumber });
    if (existingTable) {
        return res.status(400).json({ success: false, message: "Table number already exists" });
    }

    const qrSlug = crypto.randomBytes(6).toString("hex");
    const domain = process.env.DOMAIN_URL ||"https://restaurant-qr-scanner.vercel.app"|| "http://localhost:5173"; 
const qrCodeUrl = `${domain}/?table=${qrSlug}`;
    // Generate QR Image Base64
    const qrImage = await QRCode.toDataURL(qrCodeUrl);

    const table = await Table.create({
      tableNumber, capacity, qrSlug, qrCodeUrl, qrImage, isActive: true
    });

    res.status(201).json({ success: true, data: table, message: "Table Created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. GET ALL TABLES (Admin Dashboard)
export const getAllTable = async (req, res) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 }); // Sort by Table Number
    
    // ✅ FIX: Agar empty hai to bhi success return karo (Error mat pheko)
    res.status(200).json({ 
        success: true, 
        data: tables, // Empty array [] agar koi table nahi hai
        count: tables.length 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 3. GET SINGLE TABLE (By Slug for Guest)
export const getTableBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const table = await Table.findOne({ qrSlug: slug, isActive: true });

    if (!table) {
        return res.status(404).json({ success: false, message: "Invalid or Inactive Table" });
    }

    res.status(200).json({ success: true, data: table });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. DELETE TABLE (New Feature)
export const deleteTable = async (req, res) => {
    try {
        const { id } = req.params;
        await Table.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Table Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const freeTable = async (req, res) => {
    try {
        await Table.findByIdAndUpdate(req.params.id, { 
            isOccupied: false, 
            currentOwner: null // ✅ Reset owner
        });
        res.status(200).json({ success: true, message: "Table is now available" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};