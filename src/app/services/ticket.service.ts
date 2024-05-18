import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from './../../environments/environment'
import { BehaviorSubject, Observable, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  BaseUrl = environment.BaseUrl + 'tickets/';
  
  private _evolutionOutDate: BehaviorSubject<any> = new BehaviorSubject([])
  public evoulutionOutDate:Observable<any> = this._evolutionOutDate.asObservable();
  private _evolutionInDate: BehaviorSubject<any> = new BehaviorSubject([])
  public evoulutionInDate:Observable<any> = this._evolutionInDate.asObservable();

  // private _menu:BehaviorSubject<any> = new BehaviorSubject([])
  // public menu: Observable<any> = this._menu.asObservable()

  constructor(
    private http: HttpClient
  ) { }

  getSummaryByParking(parking_id:string, start_date:string, end_date:string) {
    const params = new HttpParams({
      fromObject:{
        start_date,
        end_date
      }
    })
    return this.http.get(this.BaseUrl + `get-summary/${parking_id}`, {params}).pipe(
      // tap(resp => {
      //   console.log(resp)
      //   return resp;
      // }),
      map((resp:any) => resp.summary)
    )
  }
  getSummaryEvolutionByParking(parking_id:string, start_date:string, end_date:string) {
    const params = new HttpParams({
      fromObject:{
        start_date,
        end_date
      }
    })
    return this.http.get(this.BaseUrl + `get-summary-evolution/${parking_id}`, {params}).pipe(
      // tap(resp => {
      //   console.log(resp)
      //   return resp;
      // }),
      map((resp:any) => resp.summaryEvolution)
    )
  }
  getSummaryInOut(parking_id:string, start_date:string, end_date:string) {
    const params = new HttpParams({
      fromObject:{
        start_date,
        end_date
      }
    })
    return this.http.get(this.BaseUrl + `get-summary-in-out/${parking_id}`, {params}).pipe(
      // tap(resp => {
      //   console.log(resp)
      //   return resp;
      // }),
      // map((resp:any) => resp.summaryEvolution)
    )
  }

  getTicketsEvolutionByDate(date:string, parking_id:string) {
    const params = new HttpParams({
      fromObject: {
        date
      }
    });
    return this.http.get(this.BaseUrl + `get-tickets-evolution-by-date/${parking_id}`, {params}).pipe(
      tap((resp:any) => {
        const {evoulutionInDate, evoulutionOutDate} = resp;
        this.changeInitialEvolutionInDate(evoulutionInDate)
        this.changeInitialEvolutionOutDate(evoulutionOutDate)

      }),
      // map((resp:any) => {
      //   console.log('evolDate: ',resp);

      // })
    )
  };

  changeInitialEvolutionOutDate(value:any[]) {
    this._evolutionOutDate.next(value);
  }
  changeInitialEvolutionInDate(value:any[]) {
    this._evolutionInDate.next(value);
  }

  addTicketEvolutionOutDate(value:any) {
    if(value) {
      const newValue = this._evolutionOutDate.value();
      newValue.push(value);
      this._evolutionOutDate.next(newValue)
    }
  }
  addTicketEvolutionInDate(value:any) {
    if(value) {
      const newValue = this._evolutionInDate.value();
      newValue.push(value);
      this._evolutionInDate.next(newValue)
    }
  }
  getTicketReport(id_parking:any,start_date:string, end_date:string,from:Number=0, limit:Number=10) {
    const params = new HttpParams({
      fromObject:{
        start_date,
        end_date,
        from: from.toString(),
        limit: limit.toString()
      }
    });
    return this.http.get<({data:any[],total:number})>(`${this.BaseUrl}get-ticket-report/${id_parking}`,{params})
  }
}
