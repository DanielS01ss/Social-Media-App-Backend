const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require('../models/Users');
const {check,validationResult,checkBody} = require('express-validator');
const validator = require('email-validator');
///register
///login

const registerValidate = [
  check('username').isLength({min:8}).escape().trim(),
  check('email','This must be an email').isEmail()
];

router.post('/register',
 registerValidate,
async(req,res)=>{

 if(req.body.email && req.body.password && req.body.username)
 {
    if(!validator.validate(req.body.email))
    {
      return res.status(401).json('Invalid email');
    }
    try{
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password,salt);
      const newUser = new User({
        username:req.body.username,
        email:req.body.email,
        password:hashedPassword
      });
      const userSaved = await newUser.save();
      res.status(200).json(newUser);
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
