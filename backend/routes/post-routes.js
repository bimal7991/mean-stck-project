const express=require('express');

const router=express.Router();
const Post=require('../models/post');

router.post("",(req,res,next)=>{
  const post=new Post({
         title:req.body.title,
         content:req.body.content
  });
  post.save().then(createdPost=>{
    console.log(createdPost)
   res.status(201).json({message:"post added successfully",id:createdPost._id});
  });
 console.log(post);
})

router.get("",(req,res,next)=>{
 Post.find().then(posts=>{
   res.json({
      message:"Post fetched successfully",
      posts:posts
   })
 })
})
router.get('/:id',(req,res,next)=>{
    Post.findById(req.params.id).then(post=>{
      if(post){
        console.log("post fetched")
              res.status(200).json(post);

      }
      else{
      // console.log("post fetched not found")
        res.status(400).json({message:"Post not Found"})
      }
    })

})

router.put('/:id',(req,res,next)=>{
 const post=new Post({
   _id:req.params.id,
   title:req.body.title,
   content:req.body.content
 })
 Post.updateOne({_id:req.params.id},post).then(response=>{

   console.log(response)
   res.status(200).json({message:"Post Updated Successfully"});
 })
})

router.delete("/:id",(req,res,next)=>{
 const id=req.params.id;
 console.log(id);
 Post.deleteOne({_id:id}).then(result=>{
   console.log(result);
   res.status(200).json({message:"Post deleted Successfully"})
 })
// res.json("Post deleted from backend")
})


module.exports=router;
