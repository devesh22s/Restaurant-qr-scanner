import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  // Aapki JSON file ka path
  const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");
  
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("🔥 Firebase Admin Initialized");
  } else {
    console.error("❌ serviceAccountKey.json not found in config folder");
  }
} catch (error) {
  console.error("❌ Firebase Init Error:", error.message);
}

export default admin;