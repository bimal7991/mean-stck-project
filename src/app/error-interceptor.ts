import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
 } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
 import { Observable, throwError } from 'rxjs';
 import { retry, catchError } from 'rxjs/operators';
import { ErrorComponent } from './error/error/error.component';

@Injectable()

export class ErrorInterceptor implements HttpInterceptor {

  constructor(public dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {

        return next.handle(req).pipe(
          catchError((error: HttpErrorResponse) => {
            console.log(error);
            let errorMessage="An Unknown Error Occurred";
            if(error.error.message){
              errorMessage=error.error.message;
            }
            this.dialog.open(ErrorComponent,{
              data: { message:  errorMessage}})
            return throwError(error);
          })
        )

  }
}
