import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {environment} from './../../environments/environment'
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  BaseUrl = environment.BaseUrl + 'payment/';

  constructor(
    private http: HttpClient
  ) { }

  getIconsList() {
    return this.http.get("/assets/icons/icons_list.json")
      .toPromise()
  }

  getSadminListPaymentsById(parking_id:any) {
    return this.http.get(this.BaseUrl + parking_id).pipe(
      tap(resp => {
        console.log('payments ',resp)
        return resp;
      }),
      map((resp:any) => resp.payments)
    )
  }

  updatePayment(body:any) {
    return this.http.post(this.BaseUrl + '', body).pipe(
      tap(resp => {
        console.log('payment',resp)
        return resp;
      }),
      map((resp:any) => resp.payment)
    )

  }
}
