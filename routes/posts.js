const router = require("express").Router();
const mongoose = require("mongoose");
const User = require('../models/Users');
const Post = require('../models/Posts');
const {check,validationResult,checkBody} = require('express-validator');

const registerValidate = [
  check('description').escape().trim()
]
///create post
router.post('/create',registerValidate,async(req,res)=>{
    const newPost = new Post(req.body);
    try{
      const savedPost = newPost.save();
      return res.status(200).json("Success!");
    }catch(err)
    {
      return res.status(500).json("Error while saving post!");
    }
});
///update post
router.put("/:id",async(req,res)=>{
  if(req.body.postId)
  {
    try{
      const post = Posts.findById(req.body.postId);
      if(post.userId === req.body.userId)
      {
        await post.updateOne({$set:req.body});
        return res.status(200).json("the post has been updated!");
      } else{
         return res.status(403).json("you can update only your post!");
      }

    } catch(err)
    {
      return res.status(500).json(err);
    }
  } else{
    return res.status(400).json("Bad request");
  }
})

///delete post
router.delete("/:id",async(req,res)=>{
  if(req.body.postId)
  {
    try{
        const deletedPost = await Post.findByIdAndDelete(postId);
        return res.status(400).json("Success");
    } catch(err)
    {
      return res.status(500).json("Error finding post");
    }
  }
   else{
     return res.status(400).json("Bad request!");
   }
});

///like/dislike post
router.put("/:id/like",async(req,res)=>{

  try{
    const post = new Post.findById(req.params.id);
    if(post.userId === req.body.userId)
    {
      await post.updateOne({$set:req.body});
      res.status(200).json("the post has been updated");
    } else{
      res.status(403).json("you can only update your post");
    }
  } catch(err)
  {
    res.status(500).json(err);
  }
});


///get post
router.get("/:id",async(req,res)=>{

  if(req.body.postId)
  {
    try{
      const myPost = await Post.findById(req.body.postId);
      return res.status(200).json(myPost);
    } catch(err)
    {
      console.log(err);
      return res.status(500).json('Error');
    }
  } else{
    return res.status(500).json("Bad request!");
  }

});

///get timeline post
router.get("/time/all",async(req,res)=>{
  try{
    const currentUser = await User.findById(req.body.userId);
    console.log(currentUser);
    const userPosts = await Post.find({userId:currentUser._id});
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId)=>{
          return Post.find({userId:friendId});
      })
    );
    res.json(userPosts.concat(...friendPosts));
  } catch(err)
  {
    res.status(500).json(err);
  }
})
module.exports = router;
