import Session from "../model/Session.js";
import Table from "../model/table.js"; // Ensure model filename case matches (table.js or Table.js)
import crypto from "crypto";
import { SuccessResponse, ErrorResponse } from "../utils/responseWrapper.js";

export const createSession = async (req, res, next) => {
  try {
    const { deviceId, qrSlug } = req.body;
    let tableNumber = null;

    // 1. Find Table if QR provided
    if (qrSlug) {
      const table = await Table.findOne({ qrSlug });
      if (table) {
        tableNumber = table.tableNumber;
      }
    }

    // 2. Generate Token
    const sessionToken = crypto.randomBytes(42).toString("hex");

    // 3. Set Expiry (24 Hours from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1); // Fixed: setHours(24) was wrong

    // 4. Create Session
    const session = await Session.create({
      deviceId,
      tableNumber: tableNumber || null,
      sessionToken,
      expiresAt,
    });

    // 5. Response
    return SuccessResponse(res, 201, { session, sessionToken }, "Session Created");

  } catch (error) {
    next(error);
  }
};