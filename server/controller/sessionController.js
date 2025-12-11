import Session from "../model/Session.js"
import Table from "../model/table.js"
import crypto from 'crypto'
import { SuccessResponse } from "../utils/SuccessResponse.js"

export const sessonController = async(req, res, next)=>{
    try{
        const {deviceId, qrslug} = req.body

        // using this slug i will find the tables where user scan the qr
        const table = await Table.findOne({qrslug})
        console.log("table", table);

        const tableNumber = table.tableNumber;
        const sessionToken = crypto.randomBytes(42).toString("hex");
        console.log(sessionToken);
        console.log(tableNumber);
        
        const expiresAt = new Date();
        expiresAt.setHours(24);

        //  fetch session token => expiresAt : {greater then new Date()}

        const session = new Session({
            deviceId, tableNumber, sessionToken, expiresAt
        })
        await  session.save()

        SuccessResponse(res, 201, session)
        
    }catch(error){
        next(error)

    }

}