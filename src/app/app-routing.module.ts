import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { PostCreateComponent } from './posts/post-create/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { AuthGuard } from "./auth/auth-gaurd";



const routes: Routes = [
{path:'',component:PostListComponent},
{path:'createpost',component:PostCreateComponent,canActivate:[AuthGuard]},
{path:'editpost/:postId',component:PostCreateComponent,canActivate:[AuthGuard]},
{path:'login',component:LoginComponent},
{path:'signup',component:SignupComponent}
];

@NgModule({
  providers:[AuthGuard],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
