import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from '../../post.model';
import { PostService } from '../../post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  constructor(public postService:PostService) { }


  ngOnInit(): void {
  }
  onSavePost(postForm:NgForm){
           console.log(postForm);
           if(postForm.valid){
           const post:Post={_id:null,title:postForm.value.title,content:postForm.value.content}
          // this.createPost.emit(post)
            this.postService.addPost(postForm.value.title,postForm.value.content);
            postForm.resetForm();
          }
  }
}
