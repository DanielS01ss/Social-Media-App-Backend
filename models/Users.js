const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

  username:{
    type:String,
    require:true,
    min:3,
    max:30
  },
  password:
  {
    type:String,
    required:true,
    max:50,
    min:5
  },
  email:{
    type:String,
    required:true,
  },
  profilePicture:String,
  coverPicture:String,
  followers:{
    type:Array,
    default:[]
  },
  followings:{
    type:Array,
    default:[]
  },
  isAdmin:{
    type:Boolean,
    default:false
  },
  description:{
    type:String,
    default:"",
    max:50,
  },
  city:{
    type:String,
    max:50,
  },
  from:{
    type:String,
    max:50,
  },
  relationship:{
    type:Number,
    enum:[1,2,3]
  },
  university:{
    type:String,
    max:50,
  }

},
{timestamps:true});

module.exports = mongoose.model("User",UserSchema);
