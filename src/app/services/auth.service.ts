import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom, of, pipe, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  BaseUrl:string = environment.BaseUrl;
  // BaseUrl:string = 'http://localhost:3000/api/';
  private _menu:BehaviorSubject<any> = new BehaviorSubject([])
  public menu: Observable<any> = this._menu.asObservable()

  constructor(
    private http:HttpClient,
    private router: Router
  ) { }

  validateToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';
    return this.http.get(this.BaseUrl + 'login/renew', {
      headers:{
        'x-token':token
      }
    }).pipe(
      tap((resp:any) => {
        localStorage.setItem('token', resp.token);
        this._menu.next(resp.menu);
      }),
      map(resp => true),
      catchError(error => of(false))
    );
  }

  async login(body:any) {
    return await firstValueFrom(this.http.post(this.BaseUrl + 'login', body).pipe(
      tap((resp:any) => {
        // console.log(resp);
        // console.log(resp);
        localStorage.setItem('token', resp.token);
        this._menu.next(resp.menu);
        // return resp
      }),
      catchError(err => {
        console.log('err en service ',err)
        return err
      })
    )
    )


  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/e-login')
  }
}
