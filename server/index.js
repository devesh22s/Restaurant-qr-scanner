import express from 'express'

const app = express()


app.get("/", (req, res) => {
    res.send("Home Page Working!");
});
app.listen(3000, ()=>{
    console.log("port running on 3000");
    
})