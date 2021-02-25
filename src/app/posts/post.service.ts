import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';


@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http:HttpClient) { }
  private posts:Post[]=[];
  private updatedPost=new Subject<Post[]>();
  getPosts(){
    this.http.get<{message:string,posts:Post[]}>("http://localhost:3000/api/posts").subscribe((getPosts)=>{

         this.posts=getPosts.posts;
         this.updatedPost.next([...this.posts]);
    })
  }
getUpdatedPosts(){
  return this.updatedPost.asObservable();
}
  addPost(title:string,content:string){
    const post:Post={_id:null,title:title,content:content};

    this.http.post<{message:string,id:string}>("http://localhost:3000/api/posts",post).subscribe(responePost=>{

         console.log(responePost.message);
         const postId=responePost.id;

         post._id=postId;

      this.posts.push(post);
      this.updatedPost.next([...this.posts]);
    })

  }
  deletePost(postId:string){
    this.http.delete("http://localhost:3000/api/posts/"+postId).subscribe(response=>{
      console.log("deletedPost");
      console.log(response);
      const updatedPost=this.posts.filter(post=>post._id!==postId)
      this.posts=updatedPost;
      this.updatedPost.next([...this.posts]);
    })
  }


}
