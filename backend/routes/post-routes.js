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
    //console.log("Hello world");
    const name=file.originalname.toLowerCase().split(' ').join('-');
    const ext=MIME_TYPE_MAP[file.mimetype];
    cb(null, name+'-'+Date.now()+'.'+ext)
  }
})
router.post("",AuthCheck, multer({storage:storage}).single("image"),(req,res,next)=>{
  const url=req.protocol+"://"+req.get("host");

 console.log(req.userData);
  const post=new Post({
         title:req.body.title,
         content:req.body.content,
         imagePath:url+"/images/"+req.file.filename,
         creator:req.userData.userId
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
  }).catch(err=>{
    res.status(500).json({
      message:"Post Creation Failed",
    })
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
 }).catch(err=>{
  res.status(500).json({
    message:"Fetching Post Failed",
  })
})
})
router.put('/:id',AuthCheck ,multer({storage:storage}).single("image"),(req,res,next)=>{
  const url=req.protocol+"://"+req.get("host");
  const postData=new Post({
         _id:req.params.id,
         title:req.body.title,
         content:req.body.content,
         imagePath:url+"/images/"+req.file.filename,

  });
 const post=new Post({
   _id:req.params.id,
   title:req.body.title,
   content:req.body.content,
   imagePath:postData.imagePath,
   creator:req.userData.userId
 })
 Post.updateOne({_id:req.params.id,creator:req.userData.userId},post).then(response=>{
   console.log(response)
   if(response.nModified>0){
    res.status(200).json({message:"Post Updated Successfully"});
   }
   else{
   res.status(401).json({message:"Not Authorized"})
   }

 }).catch(err=>{
  res.status(500).json({
    message:"Post Updating Failed",
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
  }).catch(err=>{
    res.status(500).json({
      message:"Fetching Post Failed",
    })
  })

})

router.delete("/:id",AuthCheck,(req,res,next)=>{
 const id=req.params.id;
 console.log(id);
 Post.deleteOne({_id:id,creator:req.userData.userId}).then(result=>{
   console.log(result);

   if(result.n>0){
    res.status(200).json({message:"Post deleted Successfully"})
   }
 else{
  res.status(401).json({message:"Not Authorized"})
 }

 }).catch(err=>{
  res.status(500).json({
    message:"Post Deletion Failed",
  })
})
// res.json("Post deleted from backend")
})


module.exports=router;
