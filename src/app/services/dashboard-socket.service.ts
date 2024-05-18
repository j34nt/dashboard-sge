import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable, map } from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DashboardSocketService {
  private _currentDateTicket: BehaviorSubject<any> = new BehaviorSubject([])
  public currentDateTicket:Observable<any> = this._currentDateTicket.asObservable();

  constructor(
    private socket: Socket
  ) {
    // super({
    //   url:`http://localhost:3000`,
    //   options:{}
    // });

    // console.log('aqui')
    this.socket.on('hellow', ((resp:any) => {
      console.log(resp)
    }))
    // this.socket.on('OUTPUT', ((resp:any) => {
    //   console.log('salidas',resp)
    // }))
    
  }

  changeCurrentDateTicket(values:any[]) {
    this._currentDateTicket.next(values);
  }

  addTicketCurrentDate(value:any) {
    let values:any[] = this._currentDateTicket.getValue();
    values.push(value);
    this._currentDateTicket.next(values);
  }
  getMessageFromParking(parking_id:string) {
    this.socket.emit('join_room',{parking_id},((resp:any) => {
      console.log('join',resp)

    }));
    this.socket.on('OUTPUT', (resp:any) => {
      console.log('park',resp);
      if(resp) {
        const {msg, ticket} = resp;
        if(msg == 'SALIDA') {
          ticket.date_in = moment('2020-01-01 00:00:00').add(ticket.time, 'seconds')
          const dateOut = ticket.value_output.substr(3,9);
          ticket.date_out = moment('2020-01-01 00:00:00').add(dateOut, 'seconds');
          ticket.duration = ticket.date_out.diff(ticket.date_in, 'hours');
          ticket.payment = [ticket.payment_id.description]
          this.addTicketCurrentDate(ticket);
        } else if(msg == 'ENTRADA') {
          console.log('TODO mensaje de entrada: ', ticket)

        }
      }
    })
    
  }
}
