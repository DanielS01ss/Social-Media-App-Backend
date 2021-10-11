const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  sender:String,
  content:String,
  time_created:new Date(),
  conversationId:String
});

module.exports = new mongoose.model('Message',MessageSchema);
