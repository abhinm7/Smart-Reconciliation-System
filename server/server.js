const express = require('express');
const connectDB = require('./config/db');

require('dotenv').config();
const PORT = process.env.PORT;

const app = express();

app.use(express.json());

connectDB();

app.get('/',(req,res)=>{
    res.send("server is on");
});

app.listen(PORT,() => {
    console.log("server started on port:", PORT)
});