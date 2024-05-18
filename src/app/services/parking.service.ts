import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from './../../environments/environment'
import { firstValueFrom, lastValueFrom, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParkingService {
  BaseUrl = environment.BaseUrl + 'parking/';
  // BaseUrl = 'http://localhost/api/';


  constructor(
    private http: HttpClient
  ) {
    this.getSadminListParkings();
  }

  getSadminListParkings() {
    return this.http.get(this.BaseUrl + 'list/sadmin').pipe(
      // tap(resp => {
      //   console.log(resp)
      //   return resp;
      // }),
      map((resp:any) => resp.parkings)
    )
  }

  createParking(body:any) {
    return this.http.post(this.BaseUrl, body,).pipe(
      // tap(resp => {
      //   console.log(resp)
      //   return resp;
      // }),
      map((resp:any) => resp.parkings)
    )
  }
  updateParking(body:any) {
    return this.http.post(this.BaseUrl + 'update', body,).pipe(
      // tap(resp => {
      //   console.log(resp)
      //   return resp;
      // }),
      map((resp:any) => resp.parkings)
    )
  }
  deleteParking(body:any) {
    // const params = new HttpParams({
    //   fromObject:{
    //     id:body.id
    //   }
    // })
    return this.http.post(this.BaseUrl + 'delete', body ).pipe(
      // tap(resp => {
      //   console.log(resp)
      //   return resp;
      // }),
      map((resp:any) => resp.parking)
    )
  }
}
