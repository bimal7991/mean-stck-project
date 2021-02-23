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

  posts:Post[]=[];

  ngOnInit(): void {
        this.postService.getPosts();
        this.postSub=this.postService.getUpdatedPosts().subscribe(post=>{
        this.posts=post;
      })
  }
  ngOnDestroy(){
    this.postSub.unsubscribe();
  }

}
