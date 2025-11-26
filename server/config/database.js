import mongoose, { connect } from "mongoose";
const dbconnect = async()=>{

    try{
       const connection =  await mongoose.connect('mongodb+srv://devesh262004_db_user:eFuccz3TUocvSDNJ@cluster0.lm3fh2n.mongodb.net/?appName=Cluster0')
        console.log('dbconnected');
        
    }
    catch(error){
        console.log(error);
        
    }
}

export default dbconnect

