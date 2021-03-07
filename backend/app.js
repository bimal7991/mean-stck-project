const express=require('express');
const path=require('path');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const postRoutes=require('./routes/post-routes')
const userRoutes=require('./routes/user-routes');
const app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use('/images',express.static( path.join("backend/images")))
mongoose.connect("mongodb+srv://bimal:bimal@1997@cluster0.4asn5.mongodb.net/mean", { useNewUrlParser: true, useUnifiedTopology: true  })
.then(()=>{
  console.log("Connected Successfully");
}).catch(()=>{
  console.log("Connection failed");
})

app.use((req,res,next)=>{
   res.setHeader("Access-Control-Allow-Origin","*");
   res.setHeader("Access-Control-Allow-Headers","Origin,Content-Type,Accept,Authorization",);
   res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,PATCH,OPTIONS,DELETE");
  next();
})

app.use('/api/posts',postRoutes);
app.use("/api/user",userRoutes);

module.exports=app;


