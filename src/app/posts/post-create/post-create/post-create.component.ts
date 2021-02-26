import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  onSavePost(postForm:NgForm){
           console.log(postForm);
           if(postForm.valid){
             this.isLoading=true;
           const post:Post={_id:null,title:postForm.value.title,content:postForm.value.content}
          // this.createPost.emit(post)
            if(this.mode==='create'){
              this.postService.addPost(postForm.value.title,postForm.value.content);
            }
            else{
              this.postService.editPost(this.postId,postForm.value.title,postForm.value.content);
            }


            postForm.resetForm();
          }
  }
}
