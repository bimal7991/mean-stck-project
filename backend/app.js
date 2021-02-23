

const express=require('express');

const bodyParser=require('body-parser');

const app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use((req,res,next)=>{
   res.setHeader("Access-Control-Allow-Origin","*");
   res.setHeader("Access-Control-Allow-Headers","Origin,Content-Type,Accept");
   res.setHeader("Access-Control-Allow-Methos","GET,POST,PUT,PATCH,OPTIONS");
  next();
})

app.post("/api/posts",(req,res,next)=>{

  const post=req.body;
  console.log(post);

  res.status(201).json({message:"post added successfully"});

})


app.use("/api/posts",(req,res,next)=>{

  const posts=[
    {
      id:123,
    title:"Server Post",
    content:"The post from the server"
   },
   {
    id:123,
  title:"Server Post",
  content:"The post from the server"
 }
  ]
  res.json({
    message:"Post fetched successfully",
     posts:posts
  })
})


module.exports=app;


