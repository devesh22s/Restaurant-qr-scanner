import { SuccessResponse } from "../utils/responseWrapper.js";
import Table from "../model/table.js";
import QRCode from "qrcode";
import crypto from "crypto";

export const createTable = async (req, res) => {
  try {
    const { tableNumber, capacity } = req.body;
    const qrSlug = crypto.randomBytes(6).toString("hex");

    // FIX: Production URL use karo, ya .env se lo
    const domain = process.env.DOMAIN_URL || "http://localhost:5173"; 
    const qrCodeUrl = `${domain}/menu?table=${qrSlug}`;

    // Generate QR Image Base64
    const qrImage = await QRCode.toDataURL(qrCodeUrl);

    const table = await Table.create({
      tableNumber, capacity, qrSlug, qrCodeUrl, qrImage
    });

    res.status(201).json({ success: true, data: table });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get table by slug

export const getTableBySlug = async (req, res) => {
  try {
    // paramas , query params , req.body
    const { slug } = req.params;
    console.log(slug);

    const table = await Table.findOne({ qrSlug: slug, isActive: true });
    console.log(table);

    res.status(200).json({
      success: true,
      data: table,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// get all table
export const getAllTable = async (req, res, next) => {
  try {
    const tables = await Table.find();
    if (tables.length <= 0) {
      const error = new Error("No table found");
      error.status = 404;
      throw error;
    }
    SuccessResponse(res, 200, tables);
  } catch (error) {
    next(error);
  }
};
