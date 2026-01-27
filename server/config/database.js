import mongoose from "mongoose";

const dbconnect = async () => {
    try {
        // Agar process.env.MONGO_URI nahi mila, tabhi hardcoded string lega (Fallback)
        const dbUrl = process.env.MONGO_URI || 'mongodb+srv://devesh262004_db_user:eFuccz3TUocvSDNJ@cluster0.lm3fh2n.mongodb.net/restaurantDB?appName=Cluster0';

        await mongoose.connect(dbUrl);
        console.log('✅ Database Connected Successfully');
    } catch (error) {
        console.error("❌ Database Connection Failed:", error);
        process.exit(1); // Agar DB fail ho jaye to server crash kar do taaki restart ho
    }
}

export default dbconnect;