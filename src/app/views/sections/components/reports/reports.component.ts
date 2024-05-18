import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cilList, cilShieldAlt, cilPencil,cilDelete, cilCheck, cilX, cilCalendar} from '@coreui/icons';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';
import { ParkingService } from 'src/app/services/parking.service';
import * as moment from 'moment';
import { TicketService } from 'src/app/services/ticket.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  idParking:any;
  icons = {cilList, cilShieldAlt, cilPencil,cilDelete, cilCheck, cilX, cilCalendar};
  parkingsList:any[] = [];
  ticketsList:any[] = [];
  totalTicket:number = 0
  limit:number = 10
  currentPage:number = 0

  model: NgbDateStruct;
  date = new Date();
  start_date:string=moment().subtract(7,'days').format('YYYY-MM-DD');
  end_date:string=moment().format('YYYY-MM-DD');
  constructor(
    private parkingService: ParkingService,
    private activateddRoute: ActivatedRoute,
    private ticketsService: TicketService
  ) {
    this.activateddRoute.params.subscribe(params => {
      console.log(params)
      const {id_parking} = params;
      if(id_parking) {
        this.idParking = id_parking;
        //TODO get tickets by id_parking
        this.getTicketsByIdParking(this.idParking)
      } else {
        //TODO
        // this.getallUsers();
      }
    });
  }

  ngOnInit(): void {
    this.getallParkings();
  }

  selectParking() {
    console.log('idParking selected ',this.idParking);
    if(this.idParking) {
      this.getTicketsByIdParking(this.idParking);
      
    }
  }
  async getallParkings() {
    const parkings = this.parkingService.getSadminListParkings();
    this.parkingsList = await firstValueFrom(parkings);
    // console.log(this.parkingsList)
  }

  changePage(value:number) {
    console.log(value)
    this.currentPage += value;
    console.log(this.currentPage)
    if(this.currentPage < 0) {
      this.currentPage = 0
    } else if(this.currentPage >= this.totalTicket) {
      this.currentPage -= value;
    }
    this.getTicketsByIdParking(this.currentPage);

  }
  async getTicketsByIdParking(from:Number) {
    const responseTickets = this.ticketsService.getTicketReport(this.idParking,this.start_date,this.end_date, from, this.limit)
    const {data, total} = await firstValueFrom(responseTickets);
    this.totalTicket = total
    console.log('reportData: ', total, data)
    if(data.length !== 0) {
      this.ticketsList = data;
    } 

  }

  onDateSelection(date: NgbDate) {
		if (!this.fromDate && !this.toDate) {
			this.fromDate = date;
      const month = this.fromDate.month < 10 ? '0' + this.fromDate.month : this.fromDate.month
      const day = this.fromDate.day < 10 ? '0' + this.fromDate.day : this.fromDate.day
      this.start_date = `${this.fromDate.year}-${month}-${day}`;
		} else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
			this.toDate = date;
      const month = this.toDate.month < 10 ? '0' + this.toDate.month : this.toDate.month
      const day = this.toDate.day < 10 ? '0' + this.toDate.day : this.toDate.day
      this.end_date = `${this.toDate.year}-${month}-${day}`;
		} else {
			this.toDate = null;
			this.fromDate = date;
      const month = this.fromDate.month < 10 ? '0' + this.fromDate.month : this.fromDate.month
      const day = this.fromDate.day < 10 ? '0' + this.fromDate.day : this.fromDate.day
      this.start_date = `${this.fromDate.year}-${month}-${day}`;
      this.end_date = '';
		}
    if(this.start_date.length > 0 && this.end_date.length > 0) {
      this.getTicketsByIdParking(this.idParking);
      //TODO get data
      // this.getSummaryByParkingEvolution();
      // this.getSummaryByParking();
      // this.getSummaryInOut()
    }
  }

  isRange(date: NgbDate) {
		return (
			date.equals(this.fromDate) ||
			(this.toDate && date.equals(this.toDate)) ||
			this.isInside(date) ||
			this.isHovered(date)
		);
	}
  
  calendar = inject(NgbCalendar);
	formatter = inject(NgbDateParserFormatter);

	hoveredDate: NgbDate | null = null;
	fromDate: NgbDate | null = this.calendar.getPrev(this.calendar.getToday(), 'd', 10);
	toDate: NgbDate | null = this.calendar.getToday()// this.calendar.getNext(this.calendar.getToday(), 'd', 10);
  isHovered(date: NgbDate) {
		return (
			this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
		);
	}

	isInside(date: NgbDate) {
		return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
	}

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
		const parsed = this.formatter.parse(input);
		return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
	}

}
