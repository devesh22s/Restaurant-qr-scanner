import express from 'express'
import dbconnect from './config/database.js';
import authrouter from './routes/auth.router.js';
import cors from "cors";

const app = express()


app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
//NOTE  fn is used to connect mongodb
dbconnect()


app.use("/api/auth", authrouter);


app.get("/", (req, res) => {
    res.send("Home Page Working!");
});
app.listen(3000, ()=>{
    console.log("port running on 3000");
    
})

