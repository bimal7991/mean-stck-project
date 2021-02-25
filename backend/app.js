const express=require('express');
const Post=require('./models/post');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');

const app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

mongoose.connect("mongodb+srv://bimal:bimal@1997@cluster0.4asn5.mongodb.net/mean?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true  })
.then(()=>{
  console.log("Connected Successfully");
}).catch(()=>{
  console.log("Connection failed");
})

app.use((req,res,next)=>{
   res.setHeader("Access-Control-Allow-Origin","*");
   res.setHeader("Access-Control-Allow-Headers","Origin,Content-Type,Accept");
   res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,PATCH,OPTIONS,DELETE");
  next();
})

app.post("/api/posts",(req,res,next)=>{
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
app.get("/api/posts",(req,res,next)=>{
  Post.find().then(posts=>{
    res.json({
       message:"Post fetched successfully",
       posts:posts
    })
  })
})

app.delete("/api/posts/:id",(req,res,next)=>{
  const id=req.params.id;
  console.log(id);
  Post.deleteOne({_id:id}).then(result=>{
    console.log(result);
    res.status(200).json({message:"Post deleted Successfully"})
  })
 // res.json("Post deleted from backend")
})


module.exports=app;


