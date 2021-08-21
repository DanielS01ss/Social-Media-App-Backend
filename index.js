const express = require("express");
const app = express();
const mongoose = require("mongoose");
const auth = require("./routes/auth.js");
const bodyparser = require("body-parser");

require('dotenv').config();
app.use(express.json());

mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true,useUnifiedTopology:true},()=>{
    console.log('Connected to MONGO DB');
});

app.use('/api/users',auth);
app.use(require('sanitize').middleware);
app.get('/',(req,res)=>{
  return res.send('Salut');
})


app.listen("8000",()=>{
 console.log('Salutare frate!');
});
