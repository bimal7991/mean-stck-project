const express=require('express');

const router=express.Router();
const Post=require('../models/post');

const AuthCheck=require('../middleware/check-auth');

const multer=require("multer");


const MIME_TYPE_MAP={
  'image/png' : 'png',
  'image/jpeg' :'jpeg',
  'image/jpg' : 'jpg'
}
const storage=multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid=MIME_TYPE_MAP[file.mimetype];
    let error=new Error("Mimetype is valid");
    console.log("hello")
    if(isValid){
      error=null;
    }
    cb(error, "backend/images")
  },
  filename:(req, file, cb)=> {
    console.log("Hello world");
    const name=file.originalname.toLowerCase().split(' ').join('-');
    const ext=MIME_TYPE_MAP[file.mimetype];
    cb(null, name+'-'+Date.now()+'.'+ext)
  }
})
router.post("",AuthCheck, multer({storage:storage}).single("image"),(req,res,next)=>{
  const url=req.protocol+"://"+req.get("host");
  const post=new Post({
         title:req.body.title,
         content:req.body.content,
         imagePath:url+"/images/"+req.file.filename
  });
  post.save().then(createdPost=>{
    console.log(createdPost)
    console.log("Post created");
    res.status(201).json({
     message:"post added successfully",
     post:{
       ...createdPost,
       _id:createdPost._id
     }

    });
  });
 console.log(post);
})

router.get("",(req,res,next)=>{
  const getPosts=Post.find();
  const pageSize=+req.query.pageSize;
  const currentPage=+req.query.page;
  let fetchPosts=null;

  if(currentPage && pageSize){
    getPosts.skip(pageSize*(currentPage-1)).limit(pageSize)
  }
   getPosts.then(posts=>{
    fetchPosts=posts;
    return Post.count();
 }).then(count=>{
  res.status(200).json({
    message:"Post fetched successfully",
    posts:fetchPosts,
    maxPosts:count
 })
 })
})
router.put('/:id',AuthCheck ,multer({storage:storage}).single("image"),(req,res,next)=>{
  const url=req.protocol+"://"+req.get("host");
  const postData=new Post({
         _id:req.params.id,
         title:req.body.title,
         content:req.body.content,
         imagePath:url+"/images/"+req.file.filename
  });
 const post=new Post({
   _id:req.params.id,
   title:req.body.title,
   content:req.body.content,
   imagePath:postData.imagePath
 })
 Post.updateOne({_id:req.params.id},post).then(response=>{
   console.log(response)
   res.status(200).json({message:"Post Updated Successfully"});
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

router.delete("/:id",AuthCheck,(req,res,next)=>{
 const id=req.params.id;
 console.log(id);
 Post.deleteOne({_id:id}).then(result=>{
   console.log(result);
   res.status(200).json({message:"Post deleted Successfully"})
 })
// res.json("Post deleted from backend")
})


module.exports=router;
