const express = require("express");
const app = express();
const mongoose = require("mongoose");
const auth = require("./routes/auth");
const bodyparser = require("body-parser");
const users = require('./routes/user');
const posts = require('./routes/posts');

require('dotenv').config();
app.use(express.json());

mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true,useUnifiedTopology:true},()=>{
    console.log('Connected to MONGO DB');
});
 
app.use(bodyparser.urlencoded({extended:false}))
app.use('/api/auth',auth);
app.use('/api/users',users);
app.use('/api/posts',posts);
app.use(require('sanitize').middleware);
app.get('/',(req,res)=>{
  return res.send('Salut');
})

app.listen("8000",()=>{
 console.log('Salutare frate!');
});
