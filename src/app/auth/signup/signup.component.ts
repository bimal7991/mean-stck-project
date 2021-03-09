import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit,OnDestroy {



  authSub:Subscription
  constructor(private authService:AuthService) { }

  isLoading=false
  ngOnInit(): void {
    this.authSub=this.authService.getAuthStatusListener().subscribe(isAuth=>{
      this.isLoading=false;
    })
  }
  onSignup(loginForm:NgForm){

    this.isLoading=true;
    this.authService.createUser(loginForm.value.username,loginForm.value.email,loginForm.value.password);
    console.log(loginForm.value)

  }
  ngOnDestroy(){
     this.authSub.unsubscribe();
  }

}
