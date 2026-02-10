import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import dotenv from "dotenv";

// Load Env variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  // ✅ Check 1: Production (Environment Variable)
  // Vercel/Render par hum JSON file ka content seedha variable me daalte hain
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    }
    console.log("🔥 Firebase Admin Initialized (via Env Var)");
  } 
  // ✅ Check 2: Localhost (File System)
  else {
    const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");
    
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
      
      if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
          });
      }
      console.log("🔥 Firebase Admin Initialized (via Local File)");
    } else {
      console.error("❌ Error: serviceAccountKey.json not found AND FIREBASE_SERVICE_ACCOUNT env missing.");
    }
  }

} catch (error) {
  console.error("❌ Firebase Init Error:", error.message);
}

export default admin;