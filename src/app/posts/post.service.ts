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
    this.http.get<{message:string,posts:Post[]}>("http://localhost:3000/api/posts").subscribe((posts)=>{

         this.posts=posts.posts;
         this.updatedPost.next([...this.posts]);
    })
  }
getUpdatedPosts(){
  return this.updatedPost.asObservable();
}
  addPost(title:string,content:string){
    const post:Post={id:null,title:title,content:content};

    this.http.post<{message:string}>("http://localhost:3000/api/posts",post).subscribe(responePost=>{

         console.log(responePost.message);

      this.posts.push(post);
      this.updatedPost.next([...this.posts]);
    })

  }


}
