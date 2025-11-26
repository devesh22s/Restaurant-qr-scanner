import express from 'express'
import dbconnect from './config/database.js';
const app = express()

//NOTE  fn is used to connect mongodb
dbconnect()
// app.use(express.urlencoded({ extended: false }));
// app.use(session({
    
//     resave: false,     
//     saveUninitialized: false,  
    
// }))

app.get("/", (req, res) => {
    res.send("Home Page Working!");
});
app.listen(3000, ()=>{
    console.log("port running on 3000");
    
})