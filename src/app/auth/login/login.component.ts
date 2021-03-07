import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private authService:AuthService) { }
  isLoading=false
  ngOnInit(): void {
  }
  onLogin(loginForm:NgForm){
    this.authService.loginUser(loginForm.value.email,loginForm.value.password)
    console.log(loginForm.value)
  }

}
