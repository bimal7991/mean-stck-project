import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../../post.model';
import { PostService } from '../../post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
   private mode='create'

   private postId=null;
   isLoading=false;


     post:Post
     filePath:File
     imagePreview:string | ArrayBuffer;
     validImage:boolean=true;

  constructor(public postService:PostService,private route:ActivatedRoute) { }
  ngOnInit(): void {



    this.route.paramMap.subscribe((paraMap:ParamMap)=>{
      if(paraMap.has('postId')){
         this.mode='edit'
         this.isLoading=true;
         this.postId=paraMap.get('postId')
         this.postService.getPost(this.postId).subscribe(post=>{
           this.post=post;
           this.isLoading=false;
         });

      }else{
        this.mode='create';
        this.postId=null;
      }
    })
  }
  onImagePicker(event:Event){
     this.filePath=(event.target as HTMLInputElement).files[0];
    const file=(event.target as HTMLInputElement).files[0];
    console.log(file);
    this.validImage=this.validateFile(file.name);
    const reader=new FileReader();
    if(this.validImage){
      reader.onload=()=>{
        this.imagePreview=reader.result;
      }
      reader.readAsDataURL(file);
    }
  }
  validateFile(name: string) {
     let ext=name.substring(name.lastIndexOf('.')+1);
    console.log(name);

    if (ext.toLowerCase() === 'png' || ext.toLowerCase()==='jpg' || ext.toLowerCase()==='jpeg') {
        return true;
    }
    else {
        return false;
    }

}
  onSavePost(postForm:NgForm){

           console.log(postForm);

           if(postForm.valid){
             this.isLoading=true;
           //const post:Post={_id:null,title:postForm.value.title,content:postForm.value.content,imagePath:this.filePath}
          // this.createPost.emit(post)
            if(this.mode==='create'){
              console.log(postForm.value.image);
              console.log(this.filePath);
              this.postService.addPost(postForm.value.title,postForm.value.content,this.filePath);
            }
            else{
              console.log("edit")
              console.log(this.filePath);
              this.postService.editPost(this.postId,postForm.value.title,postForm.value.content,this.filePath);
            }


            postForm.resetForm();

          }
  }
}
