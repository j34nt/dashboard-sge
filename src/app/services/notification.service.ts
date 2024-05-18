import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  BaseUrl:string = environment.BaseUrl;
  // BaseUrl:string = 'http://localhost:3000/api/';

  constructor(
    private http: HttpClient
  ) { }

  sendNotification(body:any) {
    const routNoti = body.type == 'SHIFT' ? 'send-by-parking' : 'send-info-by-parking'
    return this.http.post(this.BaseUrl + `notifications/${routNoti}`, body).pipe(
      tap(resp => {
        console.log(resp)
        return resp;
      }),
      map((resp:any) => {
        const value = {
          message:resp.msg,
          clients_error: resp.clientsError,
          clients: resp.clients,
          ok:resp.ok
        }
        return value;
      })
    )
  }
}
