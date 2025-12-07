import crypto from "crypto";
import QRCode from "qrcode";
import Table from "../model/table.js";

export const createTable = async (req, res) => {
  try {
    const { tableNumber, capacity } = req.body;

    // generate qr slug
    const qrSlug = crypto.randomBytes(6).toString("hex");
    console.log(qrSlug);

    // generate qr url
    const qrCodeUrl = `http://localhost:5145/scanqr?qr=${qrSlug}`;
    console.log(qrCodeUrl);

    // embed this qrCodeUrl with qrcode
       QRCode.toDataURL(qrCodeUrl, async function (err, url) {
        if (err) {
    return res.status(500).json({ message: "QR code generation failed" });
  }
        const qrImage = url
      console.log(url);
        const mytable = new Table({
        tableNumber,
        capacity,
        qrSlug,
        qrCodeUrl,
        qrImage
    })
    await mytable.save()

    res.status(201).json({
        success: true,
        data: mytable
    })


    });



  


  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



// get table by slug