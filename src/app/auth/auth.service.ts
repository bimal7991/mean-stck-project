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
   username:string;
   private userId:string;
   private authStatusListener=new Subject<boolean>();
   private userNameListener=new Subject<string>();
   constructor(private http: HttpClient,private router:Router) { }

    getToken(){
      return this.authToken;
    }
getAuthStatusListener(){
     return this.authStatusListener.asObservable();
}
getUserName(){
  return this.userNameListener.asObservable();
}
getUser(){
  return this.username;
}
getAuthStatus(){
      return this.authStatus;
}

getUserId(){
  return this.userId;
}




  createUser(username:string,email: string, password: string) {
    const userData: User = {username:username, email: email, password: password };
    this.http.post("http://localhost:3000/api/user/signup", userData).subscribe(res => {
      console.log(res);
      this.router.navigate(['/login']);
    },error=>{
      this.authStatusListener.next(false);
      console.log(error) ;

    })
  }
  loginUser(email: string, password: string) {
    const userData = { email: email, password: password };
    this.http.post<{userId:string,username:string,email:string,token:string,expiresIn:number}>("http://localhost:3000/api/user/login", userData).subscribe(res => {
      console.log(res);
      this.username=res.username;
     // this.userNameListener.next(this.username);
        this.authToken=res.token;

        if(this.authToken){
          const expiresIn=res.expiresIn;
          const expireDate=new Date( Date.now()+expiresIn*1000 )
          //console.log(expireDate)
           this.userId=res.userId;
           this.setAuthTimer(expiresIn);

           this.saveAuthData(this.authToken,expireDate,res.userId,res.username);
           this.username=res.username;
          this.authStatusListener.next(true);
          this.userNameListener.next(this.username);
          this.authStatus=true;
          this.router.navigate(["/"]);
        }

    },error=>{
      this.authStatusListener.next(false);
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
        this.userNameListener.next(this.username);
        this.userId=authInfo.userId;
        this.username=authInfo.username;
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
    this.userNameListener.next(null);

    clearTimeout(this.tokenTimeout);
    this.clearAuthData();
    this.userId=null;
    this.router.navigate(["/"]);
  }

  saveAuthData(token:string,expiresIn:Date,userId:string,username:string){
    localStorage.setItem("token",token);
    localStorage.setItem("expiresIn",expiresIn.toISOString());
    localStorage.setItem("userId",userId);
    localStorage.setItem('username',username)
  }
  clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiresIn");
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
  }

  private getAuthData(){
    const token=localStorage.getItem("token");
    const expiresIn=localStorage.getItem("expiresIn");
    const userId=localStorage.getItem("userId");
    const username=localStorage.getItem('username');
    if(!token || !expiresIn){
      return;
    }
    return {
      token:token,
      expiresIn:new Date(expiresIn),
      userId:userId,
      username:username
    }
  }


}
