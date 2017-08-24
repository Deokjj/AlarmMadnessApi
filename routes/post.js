const express = require('express');
const AlarmPostModel = require('../models/alarmPostModel');
const router = express.Router();

const mongoose = require("mongoose");

router.post('/api/newpost',(req,res,next)=>{
  const newPost = new AlarmPostModel({
    timeSet: req.body.timeSet,
    alarmCreatedAt: req.body.alarmCreatedAt,
    userId: req.body.userId,
    userName: req.body.userName,
    emoji: req.body.emoji,
    photoUrl: req.body.photoUrl,
    soundSet: req.body.soundSet
  });

  console.log('new Post: ', newPost);

  newPost.save((err,result)=>{
    if(err && newPost.errors === undefined){
      res.status(500).json({ message: '500: server fail while posting "/newPost" ' });
      return;
    }
    if(err && newPost.errors){
      res.status(400).json(err);
      return;
    }

    res.status(200).json({
      messege: 'new Post created!',
      result: result
    });

  });
});

router.get('/api/loadposts',(req,res,nexy)=>{
  AlarmPostModel.find({},null,{sort: {createdAt: 1}},(err,postArr)=>{
    if(err){
      res.status(500).json(err);
    }
    res.status(200).json(postArr);
  });
})

router.get('/api/loadposts/:userId',(req,res,next)=>{
  AlarmPostModel.find(
    {userId: req.params.userId},
    null,
    {sort: {createdAt: 1}},
    (err,postArr)=>{
    if(err){
      res.status(500).json(err);
    }
    res.status(200).json(postArr);
  });
});

router.delete('/api/deletepost',(req,res,next)=>{
  AlarmPostModel.findByIdAndRemove(req.body.id,(err,result)=>{
    if(err){
      res.status(500).json({message: 'server failed'});
    }
    res.status(200).json({
      message: 'following deleted: ',
      deletedPost: result
    });
  });
});

router.patch('/api/addcomment',(req,res,next)=>{
  let commentId = new mongoose.Types.ObjectId;
  let now = new Date();

  AlarmPostModel.findByIdAndUpdate(req.body.postId,
    {
      $push:
      {
        comments:{
          userId: req.body.userId,
          userName: req.body.userName,
          photoUrl: req.body.photoUrl,
          comment: req.body.comment,
          _id: commentId,
          createdAt: now
        }
      }
    },
    (err,updatedPost)=>{
      if(err){
        res.status(500).json(err);
      }
      else{
        res.status(200).json({
          message: 'comment Added!',
          commentInfo:{
            _id: commentId,
            createdAt: now
          }
        });
      }

    }
  );
});

router.patch('/api/deletecomment',(req,res,next)=>{
  AlarmPostModel.findByIdAndUpdate(req.body.postId,
    {
      $pull:
      {
        comments:{
          _id: req.body.commentId
        }
      }
    },
    (err,updatedPost)=>{
      if(err){
        res.status(500).json(err);
      }
      else{
        res.status(200).json({
          message: 'that comment has been deleted'
        });
      }
    }
  );
});

module.exports = router;
