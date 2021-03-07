import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Post } from './posts/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'mean-stack';
  createdPosts:Post[]=[];

  constructor(private authService:AuthService){}

  onPostCreated(post:Post){
        this.createdPosts.push(post);

        console.log(post);
  }
ngOnInit(){
  this.authService.autoAuthUser();
}

}
