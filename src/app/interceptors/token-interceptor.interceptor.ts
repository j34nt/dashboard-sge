import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({providedIn:'root'})
export class TokenInterceptorInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'x-token':token
    });

    const request = req.clone({
      headers
    })
    return next.handle(request).pipe(
      catchError(this.handleError)
    );
    
  }

  handleError(error: HttpErrorResponse){
    return throwError('')
  }
}

