import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from '../post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy {

  isAuthenticated=false;
  constructor(public postService:PostService,public authService:AuthService) { }

  private postSub:Subscription;
  private authSub:Subscription;
  isLoading=false;
  totalPost=0;
  postPerPage=2;
  pageSize=[1,2,5,10]
  currentPage=1;
  posts:Post[]=[];

  ngOnInit(): void {
         this.isLoading=true;
        this.postService.getPosts(this.postPerPage,this.currentPage);
        this.postSub=this.postService.getUpdatedPosts().subscribe((postData:{posts:Post[],maxPosts:number})=>{
        this.posts=postData.posts;
        this.totalPost=postData.maxPosts;
        this.isLoading=false;
      })
      this.isAuthenticated=this.authService.getAuthStatus();
       this.authSub=this.authService.getAuthStatusListener().subscribe(res=>{
         this.isAuthenticated=res;
       })

  }
  pageEvent(event:PageEvent){
    console.log(event);
    this.isLoading=true;
    this.currentPage=event.pageIndex+1;
    this.postPerPage=event.pageSize;
    this.postService.getPosts(this.postPerPage,this.currentPage);

  }
  onDelete(postId:string){
    this.isLoading=true;
    this.postService.deletePost(postId).subscribe(posts=>{
      this.postService.getPosts(this.postPerPage,this.currentPage);
    });

  }
  ngOnDestroy(){
    this.postSub.unsubscribe();
    this.authSub.unsubscribe();
  }

}
