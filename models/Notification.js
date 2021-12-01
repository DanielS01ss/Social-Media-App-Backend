const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  userActioned:Object,
  ownerId:String,
  postImg:String
});

module.exports = new mongoose.model("Notification",NotificationSchema);
