const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require('../models/Users');
const {check,validationResult,checkBody} = require('express-validator');
const validator = require('email-validator');
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const registerValidate = [
  check('username').isLength({min:8}).escape().trim(),
  check('email','This must be an email').isEmail()
];


router.post("/exists",async(req,res)=>{
  const response = await User.countDocuments({username:req.body.username});
  console.log(response);
  res.status(200).send("s");
})

router.post('/register',
 registerValidate,
async(req,res)=>{
  console.log(req.body);
 if(req.body.email && req.body.password && req.body.username)
 {
    if(!validator.validate(req.body.email))
    {
      return res.status(401).json('Invalid email');
    }
    try{
      // first we check if the user exists
      // the appropriate code used to signal that the user already exists in database is 422
      const countUsername = await User.countDocuments({username:req.body.username});
      const countEmail = await User.countDocuments({email:req.body.email});

      if(countUsername && countEmail)
      {
        return res.status(422).send("Username and email already exists!");
      } else if(countUsername)
      {
        return res.status(422).send("Username already exists!");
      } else if(countEmail)
      {
        return res.status(422).send("Email already exists!");
      }

      const defaultProfilePic = fs.readFileSync("./images/default-user.jpg");
      const defaultBackgroundPic = fs.readFileSync("./images/default-background.jpg");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password,salt);
      const defBkgData = defaultBackgroundPic.toString("base64");
      const defProfPic = defaultProfilePic.toString("base64");
      const newUser = new User({
        username:req.body.username,
        email:req.body.email,
        password:hashedPassword,
        profilePicture:defBkgData,
        coverPicture:defProfPic
      });
       newUser.save();

      res.status(200).json();
    } catch(err)
    {
      res.status(500).json(err);
    }
 }
 else{
  return res.status(400).json('Invalid request');
 }
});

router.post('/login',async(req,res)=>{
  console.log(req.body);
  if(req.body.username && req.body.password && req.body.email)
  {
    try{
      const user = await User.findOne({email:req.body.email});
      if(user)
      {
        const validPassword = await bcrypt.compare(req.body.password,user.password);
        return res.status(200).json(user);
      }
      else{
        return res.status(401).json("Did not found user");
      }

    } catch(err)
    {
      console.log(err);
      res.status(404).json('Error');
    }
  }
  else{
    return res.status(400).json('Provide email and/or password')
  }
  return res.send('Hello')
});

module.exports = router;
