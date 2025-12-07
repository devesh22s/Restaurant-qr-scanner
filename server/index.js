import express from 'express'
import dbconnect from './config/database.js';
import authrouter from './routes/auth.router.js';
import tablerouter from './routes/table.route.js';
import cors from "cors";
import verify from './middleware/verify.js';
import checkRole from './middleware/checkRole.js';

const app = express()


app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "https://restaurant-qr-scanner-1qo7.vercel.app"],  // never use * 
  credentials: true
}));
//NOTE  fn is used to connect mongodb
dbconnect()



// for guest ->

app.get("/menu", verify, checkRole(['customer', 'admin']), (req, res)=>{
  // if(req.headers.authorization){
  //   return res.send("you can access the menu")
  // }else{
  //   return res.send("you are not authorize, please login")
  // }
  res.send("menu fetched")
})



app.get("/", (req, res) => {
    res.send("Home Page Working!");
});


app.use("/api/auth", authrouter);
app.use("/api/auth", tablerouter )


app.listen(3000, ()=>{
    console.log("port running on 3000");
  
})

