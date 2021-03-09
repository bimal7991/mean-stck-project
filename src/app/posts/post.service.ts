import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Post } from './post.model';


@Injectable({
  providedIn: 'root'
})
export class PostService implements OnInit {


  constructor(private http: HttpClient, private router: Router) { }
  ngOnInit() {

  }
  private posts: Post[] = [];
  private updatedPost = new Subject<{ posts: Post[], maxPosts: number }>();
  getPosts(pageSize: number, currentPage: number) {
    const queryParam = `?pageSize=${pageSize}&page=${currentPage}`;
    this.http.get<{ message: string, posts: any, maxPosts: number }>
      ("http://localhost:3000/api/posts" + queryParam).subscribe((getPosts) => {

        this.posts = getPosts.posts;
        console.log(this.posts)
        this.updatedPost.next({
          posts: [...this.posts],
          maxPosts: getPosts.maxPosts
        });
      })
  }
  getUpdatedPosts() {
    return this.updatedPost.asObservable();
  }

  getPost(id: string) {
    console.log("helo")
    return this.http.get<Post>("http://localhost:3000/api/posts/" + id)
  }

  addPost(title: string, content: string, image: File) {
    //const post:Post={_id:null,title:title,content:content};
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, "hello");
    this.http.post<{ message: string, post: Post }>("http://localhost:3000/api/posts", postData).subscribe(responePost => {
      this.router.navigate(['/']);
    })

  }
  editPost(id: string, title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("_id", id)
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, "hello");
    postData.append('creator',null)
    console.log(postData.get("image"));
   // const post: Post = { _id: id, title: title, content: content, imagePath: image };
    this.http.put("http://localhost:3000/api/posts/" + id, postData).subscribe(response => {
      this.router.navigate(['/']);
    })
  }

  deletePost(postId: string) {
    return this.http.delete("http://localhost:3000/api/posts/" + postId);
  }


}
