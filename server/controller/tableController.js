import crypto from "crypto";
import QRCode from "qrcode";
import Table from "../model/table.js";
import { SuccessResponse } from "../utils/SuccessResponse.js";
import os from "os";

export const createTable = async (req, res) => {
  try {
    const { tableNumber, capacity } = req.body;

    // generate qr slug
    const qrSlug = crypto.randomBytes(6).toString("hex");
    // console.log(qrSlug);

    // fetching dynamic ip address for development environment
    const data = os.networkInterfaces()["Wi-Fi"];
    let ipAddress = null;
    for (const el of data) {
      if (el.family === "IPv4") ipAddress = el.address;
    }
    console.log(ipAddress);

    // generate qr url
    const qrCodeUrl = `http://${ipAddress}:5173/welcome?qr=${qrSlug}`;
    console.log(qrCodeUrl);

    // embed this qrCodeUrl with qrcode
    QRCode.toDataURL(qrCodeUrl, async (err, url) => {
      if (err) {
        return res.status(500).json({ message: "QR code generation failed" });
      }
      const qrImage = url;
      console.log(url);
      const mytable = new Table({
        tableNumber,
        capacity,
        qrSlug,
        qrCodeUrl,
        qrImage,
      });
      await mytable.save();

      res.status(201).json({
        success: true,
        data: mytable,
      });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
