import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
    tableNumber: {
        type: Number,
        required: true,
        unique: true 
    },
    capacity: {
        type: Number,
        required: true
    },
    qrSlug: {
        type: String,
        required: true
    },
    qrCodeUrl: {
        type: String,
        required: true
    },
    qrImage: {
        type: String
    },
    
    // ✅ 1. Table Status (Operational / Under Maintenance)
    isActive: {
        type: Boolean,
        default: true 
    },

    // ✅ 2. Occupancy Status (Free / Reserved)
    // when someone placed the order then it will true
    isOccupied: {
        type: Boolean,
        default: false
    },
    currentOwner: { type: String, default: null },

    // ✅ 3. Live Tracking Fields (Optional but Recommended)
    currentOrderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        default: null
    },
    
    // if Guest User then his Session Token store here
    currentSessionToken: {
        type: String,
        default: null
    }

}, { timestamps: true });

const Table = mongoose.model("Table", tableSchema);

export default Table;