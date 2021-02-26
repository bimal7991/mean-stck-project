import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Post } from './post.model';


@Injectable({
  providedIn: 'root'
})
export class PostService implements OnInit {


  constructor(private http:HttpClient,private router:Router) { }
  ngOnInit(){

  }
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

getPost(id:string){
  console.log("helo")
   return this.http.get<Post>("http://localhost:3000/api/posts/"+id)
}

  addPost(title:string,content:string){
    const post:Post={_id:null,title:title,content:content};

    this.http.post<{message:string,id:string}>("http://localhost:3000/api/posts",post).subscribe(responePost=>{

         console.log(responePost.message);
         const postId=responePost.id;

         post._id=postId;

      this.posts.push(post);
      this.updatedPost.next([...this.posts]);
      this.router.navigate(['/']);
    })

  }
  editPost(id:string,title:string,content:string){
     const post:Post={_id:id,title:title,content:content};
     this.http.put("http://localhost:3000/api/posts/"+id,post).subscribe(response=>{
      console.log(response)
      const updatedPosts=[...this.posts];
      const index=updatedPosts.findIndex(p=>p._id===id);

      updatedPosts[index]=post;

      this.posts=updatedPosts;
      this.updatedPost.next([...this.posts]);
      this.router.navigate(['/']);
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
