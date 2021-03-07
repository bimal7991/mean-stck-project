import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './auth.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
   private authToken:string
   authStatus=false;
   tokenTimeout:any;
   private authStatusListener=new Subject<boolean>();
   constructor(private http: HttpClient,private router:Router) { }

    getToken(){
      return this.authToken;
    }
getAuthStatusListener(){
     return this.authStatusListener.asObservable();
}
getAuthStatus(){
      return this.authStatus;
}



  createUser(email: string, password: string) {
    const userData: User = { email: email, password: password };
    this.http.post("http://localhost:3000/api/user/signup", userData).subscribe(res => {
      console.log(res);
    })
  }
  loginUser(email: string, password: string) {
    const userData: User = { email: email, password: password };
    this.http.post<{userId:string,email:string,token:string,expiresIn:number}>("http://localhost:3000/api/user/login", userData).subscribe(res => {
      console.log(res);
        this.authToken=res.token;
        if(this.authToken){
          const expiresIn=res.expiresIn;
          const expireDate=new Date( Date.now()+expiresIn*1000 )
          console.log(expireDate);



        this.setAuthTimer(expiresIn);

           this.saveAuthData(this.authToken,expireDate);

          this.authStatusListener.next(true);
          this.authStatus=true;
          this.router.navigate(["/"]);
        }

    })
  }

  autoAuthUser(){
    const authInfo=this.getAuthData();
    if(authInfo){
      const nowDate=new Date();
      const isAuthFuture=authInfo.expiresIn.getTime()-nowDate.getTime();
      if(isAuthFuture>0){
        this.authToken=authInfo.token;
        this.authStatusListener.next(true);
        this.authStatus=true;
        this.setAuthTimer(isAuthFuture/1000);
      }
    }
  }

  setAuthTimer(duration){
    this.tokenTimeout=setTimeout(() => {
      this.logout()

    }, duration*1000);
  }

  logout(){
    this.authToken=null;
    this.authStatus=false;
    this.authStatusListener.next(false);

    clearTimeout(this.tokenTimeout);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  saveAuthData(token:string,expiresIn:Date){
    localStorage.setItem("token",token);
    localStorage.setItem("expiresIn",expiresIn.toISOString())
  }
  clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiresIn");
  }

  private getAuthData(){
    const token=localStorage.getItem("token");
    const expiresIn=localStorage.getItem("expiresIn");
    if(!token || !expiresIn){
      return;
    }
    return {
      token:token,
      expiresIn:new Date(expiresIn)
    }
  }


}
