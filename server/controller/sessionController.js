import Table from "../model/table.js"
import crypto from 'crypto'

export const sessonController = async(req, res)=>{
    try{
        const {deviceId, qrslug} = req.body

        // using this slug i will find the tables where user scan the qr
        const table = await Table.findOne({qrslug})
        console.log(table);

        const tableNumber = table.tableNumber;
        const sessionToken = crypto.randomBytes(42).toString("hex");
        console.log(sessionToken);
        console.log(tableNumber);
        
        
        
    }catch(error){


    }

}