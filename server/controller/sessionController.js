import Session from "../model/Session.js";
import Table from "../model/table.js";
import crypto from "crypto";
import { SuccessResponse } from "../utils/responseWrapper.js";

export const sessonController = async (req, res, next) => {
  try {
    const { deviceId, qrslug } = req.body;
    let tableNumber = null;

    // If qrSlug is provided, find the table
    if (qrslug) {
      const table = await Table.findOne({ qrSlug });
      if (table) {
        tableNumber = table.tableNumber;
      }
    }

   ;

    const sessionToken = crypto.randomBytes(42).toString("hex");
    // console.log(sessionToken);
    // console.log(tableNumber);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);

// Create session - tableNumber is optional (for guest without QR scan)
    const session = new Session({
      deviceId,
      tableNumber: tableNumber || null,
      sessionToken,
      expiresAt,
    });
    await session.save();

    SuccessResponse(res, 201,  { session, sessionToken });
  } catch (error) {
    next(error);
  }
};
