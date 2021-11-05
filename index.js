const express = require("express");
const app = express();
const mongoose = require("mongoose");
const auth = require("./routes/auth");
const bodyparser = require("body-parser");
const users = require('./routes/user');
const posts = require('./routes/posts');
const cors = require("cors");
const messages = require("./routes/messages.js");
const io = require('socket.io')(8080,{
	cors:{
	  origin:['http://localhost:3000']
	}
});


require('dotenv').config();
app.use(express.json({limit:"25mb"}));
app.use(express.text({limit:"25mb"}));
app.use(cors());

mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true,useUnifiedTopology:true},()=>{
    console.log('Connected to MONGO DB');
});

app.use(bodyparser.urlencoded({extended:false}))
app.use('/api/message',messages);
app.use('/api/auth',auth);
app.use('/api/user',users);
app.use('/api/posts',posts);
app.use(require('sanitize').middleware);
app.get('/',(req,res)=>{
  return res.send('Salut');	
})

io.on('connection',socket=>{
  console.log(socket.id);
  socket.on('custom-event',(number1,number2)=>{
  	console.log(`${number1} and ${number2}`);
  });

  socket.on('send-message',(msg)=>{
  	console.log('The message from the client was:',msg);
  	///acest io.emit ce face este ca trimite datele de la server catre user
  	///TRIMITE ACEST REQUEST LA TOTI CLIENTI ASA CA AI DE GRIJA!!!
  	io.emit('receive-message','Ba eu am primit mesajul acuma vezi tu ce faci');
  });
})



app.listen(8000,()=>{
 console.log('Salutare frate!');
});
