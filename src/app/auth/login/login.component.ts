import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy {
  authSub:Subscription
  constructor(private authService:AuthService) { }

  isLoading=false
  ngOnInit(): void {
    this.authSub=this.authService.getAuthStatusListener().subscribe(isAuth=>{
      this.isLoading=false;
    })
  }
  onLogin(loginForm:NgForm){
    this.isLoading=true;
    this.authService.loginUser(loginForm.value.email,loginForm.value.password)
    console.log(loginForm.value)
  }
  ngOnDestroy(){
    this.authSub.unsubscribe();
  }

}
