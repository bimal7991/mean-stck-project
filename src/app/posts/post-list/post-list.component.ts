import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy {

  constructor(public postService:PostService) { }

  private postSub:Subscription;

  isLoading=false;

  posts:Post[]=[];

  ngOnInit(): void {
         this.isLoading=true;
        this.postService.getPosts();
        this.postSub=this.postService.getUpdatedPosts().subscribe(post=>{
        this.posts=post;
        this.isLoading=false;
      })
  }
  onDelete(postId:string){
    this.isLoading=true;
    this.postService.deletePost(postId);
     this.isLoading=false;
  }
  ngOnDestroy(){
    this.postSub.unsubscribe();
  }

}
