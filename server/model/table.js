import mongoose from "mongoose"


const tableSchema = new mongoose.Schema({
    tableNumber: {
        type: Number,
        required: true,
        // unique: true
    },
    qrSlug:{
        type: String,
        required: true
    },
    qrcode:{
        type: String,
        required: true
    },
    qrImage:{
        type: String
    },
    capacity:{
        type: Number,
        
    }

})

const Table = mongoose.model("Table", tableSchema)

export default Table