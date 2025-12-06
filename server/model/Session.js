import mongoose from 'mongoose'


const SessionSchema = new mongoose.Schema({
    sessionToken :{
        type: String,
        default: null
    },
    deviceId :{
         type: String,
        default: null

    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    ip:{
        type: String
    },
    userAgent:{
        type: String
    },
    tableNumber:{
        type: Number
    },
    qrCodeUrl:{
        type: String
    }, 
    convertedSession:{
        type: Boolean,
        default : false
    }, 
    lastActivity:{
        type:Date
    }
})

const Session = mongoose.model('session', SessionSchema)

export default Session