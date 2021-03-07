import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {

  isAuthenticated=false;
  authenticatedSub:Subscription
  constructor(public authService:AuthService) { }



  ngOnInit(): void {
     this.isAuthenticated=this.authService.getAuthStatus();

    this.authenticatedSub=this.authService.getAuthStatusListener().subscribe(res=>{
          this.isAuthenticated=res
    })
  }

  onLogout(){
    this.authService.logout();
  }


  ngOnDestroy(){
    this.authenticatedSub.unsubscribe();
  }

}
