const bcrypt=require('bcrypt');
const User = require('../models/user');
const jwt=require("jsonwebtoken");

exports.createUser=(req,res,next)=>{
  bcrypt.hash(req.body.password,10).then(hash=>{
    const user=new User({
      username:req.body.username,
      email:req.body.email,
      password:hash
    })

  User.find({email:req.body.email}).then(user=>{
    if(user){
      res.status(500).json({
        message:"This User already exists"
      })
    }
  })


    user.save().then(result=>{
      res.status(201).json({
        message:"User Created",
        result:result
      })
    }).catch(error=>{
      res.status(500).json({
        error:error,
        message:"User Creation failed"
      })
    })
  })
}

exports.loginUser=(req,res,next)=>{
  let fetchedUser;
  User.findOne({email:req.body.email}).then(user=>{
    if(!user){
      return res.status(401).json({
        message:"User does not Exits"
      })
    }
    fetchedUser=user;
   return  bcrypt.compare(req.body.password,user.password)
  })
   .then(result=>{
       console.log(result)
       if(!result){
        return res.status(401).json({
          message:"Invalid Email or Password"
        })
       }
       const token=jwt.sign({email:fetchedUser.email,userId:fetchedUser._id},'some_super_secret_key',
       { expiresIn:"1h" });
       res.status(200).json({

         userId:fetchedUser._id,
         username:fetchedUser.username,
         email:fetchedUser.email,
         token:token,
         expiresIn:3600
       })
     }).catch(error=>{
      return res.status(401).json({
        message:"Authentication Failed",
        error:error
      })
     })


  }
