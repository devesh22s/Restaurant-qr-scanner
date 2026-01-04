import mongoose from 'mongoose'


const SessionSchema = new mongoose.Schema({
    sessionToken :{
        type: String,
        default: null

    },  //  created from backend

    deviceId :{
         type: String,
        default: null

    }, // client will send

    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    ip:{
        type: String
    },

    userAgent:{
        type: String
    }, // req.headers.userAgent

    tableNumber:{
        type: Number
    }, //qrslug client => table ko find => table variable ke andar data hoga => get tableNumber

    qrCodeUrl:{
        type: String
    }, 
    convertedSession:{
        type: Boolean,
        default : false
    }, 
    expiresAt:{
        type : Date
    },
    lastActivity:{
        type:Date
    }
})

const Session =mongoose.models.session || mongoose.model('session', SessionSchema)

export default Session;
