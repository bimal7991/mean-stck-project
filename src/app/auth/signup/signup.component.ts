import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private authService:AuthService) { }

  isLoading=false
  ngOnInit(): void {
  }
  onSignup(loginForm:NgForm){

    this.authService.createUser(loginForm.value.email,loginForm.value.password);
    console.log(loginForm.value)

  }

}
