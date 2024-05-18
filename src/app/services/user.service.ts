import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  BaseUrl = environment.BaseUrl + 'parking/';
  BaseUrlUsers = environment.BaseUrl + 'user/';

  private _user:BehaviorSubject<any> = new BehaviorSubject(null);
  public user: Observable<any> = this._user.asObservable();


  constructor(
    private http: HttpClient
  ) { }

  changeUser(value:any) {
    this._user.next(value);
  }

  getAllUsers() {
    return this.http.get(this.BaseUrlUsers + 'all').pipe(
      tap(resp => {
        console.log(resp)
        return resp;
      }),
      map((resp:any) => resp.users)
    )
  }
  getUsersByParkingDe(id_parking:string) {
    return this.http.get(this.BaseUrlUsers + `users/${id_parking}`).pipe(
      tap(resp => {
        console.log(resp)
        return resp;
      }),
      map((resp:any) => resp.users)
    )
  }
  updateUser(body:any) {
    return this.http.post(this.BaseUrlUsers + 'update', body, ).pipe(
      tap(resp => {
        console.log(resp);
        return resp;
      }),
      map((resp:any) => resp.user)
    );
  }

  getUsersByParking(id:string) {
    return this.http.get(this.BaseUrl + 'list/sadmin').pipe(
      tap(resp => {
        console.log(resp)
        return resp;
      }),
      map((resp:any) => resp.parkings)
    )
  }
}
