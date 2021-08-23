const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/Users");
const validator = require("email-validator");
const bcrypt = require("bcrypt");
const {check,validationResult,checkBody} = require('express-validator');

///update user
const registerValidate = [
  check("description").trim().escape()
]

router.put("/:id/update",
registerValidate
,async(req,res)=>{

  if(req.body.userId === req.params.id || req.body.isAdmin)
  {
    if(req.body.password)
    {
      try{
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password,salt);
      }
      catch(err)
      {
        res.status(500).json(err);
      }
    }
  try{
    const user = await User.findByIdAndUpdate(req.params.id,{$set:req.body});
    res.status(200).json("Account has been updated!");
  } catch(err)
  {
    res.status(500).json(err);
  }
  }
  else{
    return res.status(403).json("You can only update your account!");
  }
});

///get user
router.get("/:id",async(req,res)=>{
    try{
      const user = await User.findById(req.params.id);

      const {password,createdAt,updatedAt,_id,...others} = user._doc;
      return res.status(200).json(others);
    } catch(err)
    {
      return res.status(500).json(err);
    }
});
///delete user

router.delete("/:id",async(req,res)=>{
  ///functia este findById and delete
  if(req.body.userId === req.params.id || req.body.isAdmin)
  {
    try{
      const myUser = await User.findByIdAndDelete(req.body.userId);
      res.status(200).json("Account has been deleted");
    } catch(err)
    {
      return res.status(500).json(err);
    }
  } else{
    return res.status(403).json("You can only update your account");
  }
});

//follow a user
router.put('/:id/follow',async(req,res)=>{

  let user;
  let toFollow;
  if(req.body.userId)
  {
     try{
        user = await User.findById(req.body.userId);
        toFollow = await User.findById(req.params.id);
     }
     catch(err)
     {
       return res.status(404).json("User not found");
     }
     if(!user.followings.includes(req.params.id))
     {
       try{
          await user.updateOne({$push:{followings:req.params.id}});
          await toFollow.updateOne({$push:{followers:req.body.userId}});
       } catch(err)
       {
        return res.status(500).json("Error while processing request!");
       }

     } else{
       return res.status(400).json("You already follow this user!");
     }

  } else{
    return res.status(400).json("Bad request");
  }
});

router.put("/:id/unfollow",async(req,res)=>{
  let user;
  let toUnfollowUser;
  if(req.body.userId)
  {
    try{
      user = await User.findById(req.body.userId);
      toUnfollowUser = await User.findById(req.params.id);

    } catch(err)
    {
    return res.status(404).json("User not found");
    }
    if(user.followings.includes(req.params.id))
    {
      try{
        await user.updateOne({$pull:{followings:req.params.id}});
        await toUnfollowUser.updateOne({$pull:{followers:req.body.userId}});
        return res.status(200).json("Success");
      } catch(err)
      {
        res.status(500).json("Error");
      }

    }
    else{
      return res.status(400).json("You don't follow this user!");
    }
 return res.status(200).json("Here is my data master!");

  } else{
    return res.status(400).json("Bad request");
  }

});

module.exports = router;
