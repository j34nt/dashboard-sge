import { Component, OnDestroy, OnInit,inject  } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { DashboardChartsData, IChartProps } from './dashboard-charts-data';
import { ParkingService } from 'src/app/services/parking.service';
import { TicketService } from 'src/app/services/ticket.service';
import { DashboardSocketService } from 'src/app/services/dashboard-socket.service';
import { combineLatest, firstValueFrom } from 'rxjs';
import { getStyle, hexToRgba } from '@coreui/utils';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
// import * as _ from 'lodash';

interface IUser {
  name: string;
  state: string;
  registered: string;
  country: string;
  usage: number;
  period: string;
  payment: string;
  activity: string;
  avatar: string;
  status: string;
  color: string;
}

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  listParking:any[] = [];
  idParking:any;
  dataSummary:any;
  dataSummaryBase:any;
  dataSummaryEvolution:any;
  selectedDataProperty:string="countTotal";
  model: NgbDateStruct;
  classSummary:any[] = ["info", "success", "danger", "warning"];
  date = new Date();
  maxValueChart = 10;
  start_date:string=moment().subtract(7,'days').format('YYYY-MM-DD');
  end_date:string=moment().format('YYYY-MM-DD');
  dataProperty:any[] = [
    {id:1,selected:true,label:'Nro',property:"countTotal"},
    {id:2,selected:false,label:'$',property:"totalAmount"}
  ]
  plugins = {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        labelColor: function(context: any) {
          return {
            backgroundColor: context.dataset.borderColor
          };
        }
      }
    }
  };
  brandSuccess = getStyle('--cui-success') ?? '#4dbd74';
  brandInfo = getStyle('--cui-info') ?? '#20a8d8';
  brandInfoBg = hexToRgba(this.brandInfo, 10);
  brandDanger = getStyle('--cui-danger') || '#f86c6b';
  colors = [
    {
      // brandInfo
      backgroundColor: this.brandInfoBg,
      borderColor: this.brandInfo,
      pointHoverBackgroundColor: this.brandInfo,
      borderWidth: 2,
      fill: true
    },
    {
      // brandSuccess
      backgroundColor: 'transparent',
      borderColor: this.brandSuccess || '#4dbd74',
      pointHoverBackgroundColor: '#fff'
    },
    {
      // brandDanger
      backgroundColor: 'transparent',
      borderColor: this.brandDanger || '#f86c6b',
      pointHoverBackgroundColor: this.brandDanger,
      borderWidth: 1,
      borderDash: [8, 5]
    }
  ];
  options = {
    maintainAspectRatio: false,
    plugins:this.plugins,
    scales: {
      x: {
        grid: {
          drawOnChartArea: false
        }
      },
      y: {
        beginAtZero: true,
        max: this.maxValueChart,
        ticks: {
          maxTicksLimit: 5,
          stepSize: Math.ceil(this.maxValueChart / 5)
        }
      }
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3
      }
    }
  };
  summaryInOut:any;
  summaryInDetail:any[] =[];
  summaryOutDetail:any[] =[];
  idParkingSelected:any;
  summaryDetailData:any;
  isClient = false;
  detailTickest:any[] = []

  constructor(
    private chartsData: DashboardChartsData,
    private parkingService: ParkingService,
    private tickesService: TicketService,
    private activatedRoute: ActivatedRoute,
    private dashboardSocket: DashboardSocketService
  ) {
    this.activatedRoute.params.subscribe(params => {
      const {id_parking} = params;
      if(id_parking) {
        this.isClient = true;
        this.idParking = id_parking;
        this.selectParking();
        setTimeout(() => {
          this.subscribeToSocket();
        }, 5000);
      }
    });
    const CurrentTicketsEvolutionSubscribe = combineLatest({evolutionOutDate:this.dashboardSocket.currentDateTicket})

    CurrentTicketsEvolutionSubscribe.subscribe((evolution:any) => {
      if(evolution) {
        this.detailTickest = evolution.evolutionOutDate;
        this.setSummaryDetailData()
      }
    })
    
  }

  public users: IUser[] = [
    {
      name: 'Yiorgos Avraamu',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'Us',
      usage: 50,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Mastercard',
      activity: '10 sec ago',
      avatar: './assets/img/avatars/1.jpg',
      status: 'success',
      color: 'success'
    },
    {
      name: 'Avram Tarasios',
      state: 'Recurring ',
      registered: 'Jan 1, 2021',
      country: 'Br',
      usage: 10,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Visa',
      activity: '5 minutes ago',
      avatar: './assets/img/avatars/2.jpg',
      status: 'danger',
      color: 'info'
    },
    {
      name: 'Quintin Ed',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'In',
      usage: 74,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Stripe',
      activity: '1 hour ago',
      avatar: './assets/img/avatars/3.jpg',
      status: 'warning',
      color: 'warning'
    },
    {
      name: 'Enéas Kwadwo',
      state: 'Sleep',
      registered: 'Jan 1, 2021',
      country: 'Fr',
      usage: 98,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Paypal',
      activity: 'Last month',
      avatar: './assets/img/avatars/4.jpg',
      status: 'secondary',
      color: 'danger'
    },
    {
      name: 'Agapetus Tadeáš',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'Es',
      usage: 22,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'ApplePay',
      activity: 'Last week',
      avatar: './assets/img/avatars/5.jpg',
      status: 'success',
      color: 'primary'
    },
    {
      name: 'Friderik Dávid',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'Pl',
      usage: 43,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Amex',
      activity: 'Yesterday',
      avatar: './assets/img/avatars/6.jpg',
      status: 'info',
      color: 'dark'
    }
  ];
  public mainChart: IChartProps = {};
  public mainChartTemp: IChartProps = {};
  public chart: Array<IChartProps> = [];
  public trafficRadioGroup = new UntypedFormGroup({
    trafficRadio: new UntypedFormControl(this.dataProperty.find((item:any) => item.selected == true).property)
  });

  ngOnInit(): void {
    this.initCharts();
    this.getParkingsList();
    this.getTicketsEvolutionByDate();
  }
  ngOnDestroy() {
    // console.log((''));
    //TODO quitar socket
    
    // this.dashboardSocket
  }
  subscribeToSocket() {
    this.dashboardSocket.getMessageFromParking(this.idParking)
    // this.dashboardSocket
  }

  initCharts(): void {
    this.mainChart = this.chartsData.mainChart;
    // console.log(this.mainChart)
  }

  setTrafficPeriod(value: string): void {
    this.mainChartTemp = {};
    this.selectedDataProperty = value;
    this.trafficRadioGroup.setValue({ trafficRadio: value });
    this.setSummaryData();
    setTimeout(() => {
      this.setgraphData();      
    }, 100);
    // this.chartsData.initMainChart(value);
    // this.initCharts();
  }

  async getParkingsList(){
    const parkings = this.parkingService.getSadminListParkings();
    this.listParking = await firstValueFrom(parkings);
    // if(this.idParkingSelected) {
    //   this.listParking.map(item => {
    //     item.selected = item.id_parking == this.idParkingSelected ? true : false;
    //     return item;
    //   })
    // }
  }

  async getSummaryByParkingEvolution() {
    this.dataSummaryEvolution = [];
    this.mainChartTemp = {};
    const summary = this.tickesService.getSummaryEvolutionByParking(this.idParking,this.start_date,this.end_date)
    const resp:any = await firstValueFrom(summary);
    if(resp && resp.length > 0) {
        this.dataSummaryEvolution = resp.map((item:any,idx:number) => {
          item.percentageClass = this.classSummary[idx];
          item.percentage = Math.round(item.percentage*100) / 100;
          return item;
        });
        this.dataSummaryBase = JSON.parse(JSON.stringify(this.dataSummaryEvolution));
        this.setgraphData();
        
    }


  }

  async getSummaryInOut() {
    const response = this.tickesService.getSummaryInOut(this.idParking, this.start_date, this.end_date);
    const resp:any = await firstValueFrom(response);
    if(resp) {
      this.summaryInOut = resp?.summary;
      this.summaryInDetail = resp?.summaryInDetail;
      this.summaryOutDetail = resp?.summaryOutDetail;

    }
  }
  async getSummaryByParking() {
    this.dataSummaryBase = [];
    const summary = this.tickesService.getSummaryByParking(this.idParking,this.start_date,this.end_date)
    const resp = await firstValueFrom(summary);
    if(resp && resp.length > 0) {
      this.dataSummaryBase = resp;
      this.setSummaryData();
      


    }
  }

  setgraphData() {
        this.mainChartTemp.type = 'line';
        this.mainChartTemp["elements"] = this.dataSummaryEvolution[0].dataEvolution.length
        this.options.scales.y.max = Math.max(...this.dataSummaryEvolution.map((o:any) => o[this.selectedDataProperty])) + 5;
        this.mainChartTemp.options = this.options;

        this.mainChartTemp.data = {
          datasets: this.dataSummaryEvolution.map((item:any,idx:number) => {
            this.mainChart[`Data${idx}`] = [];
            const value = {
              data: item.dataEvolution.map((ite:any) => {
                this.mainChart[`Data${idx}`].push(ite[this.selectedDataProperty])
                return ite[this.selectedDataProperty]
              }),
              label: item.name,
              fill:true,
              ...this.colors[idx]
            }
            return value;
          }),
          labels : this.dataSummaryEvolution[0].dataEvolution.map((item:any) => item.date)
        };
  }

  setSummaryData() {
    this.dataSummary = [];
    const total = this.dataSummaryBase.reduce((n:any, item:any) => n + +item[this.selectedDataProperty],0);
      this.dataSummary = this.dataSummaryBase.map((item:any,idx:number) => {
        const value = {
          display_name:item.name,
          value:item[this.selectedDataProperty],
          percentage:total ? ((+item[this.selectedDataProperty]*100)/total).toFixed(1) : 0,
          percentageClass: this.classSummary[idx]
        }
        return value
      })
  }
  selectParking() {
    this.mainChartTemp = {};
    this.dataSummary = {};
    this.dataSummaryBase = [];
    if(this.start_date.length > 0 && this.end_date.length > 0)
    {
      this.getSummaryByParkingEvolution();
      // this.getSummaryByParking();
      this.getSummaryInOut()
    }
    
  }

  calendar = inject(NgbCalendar);
	formatter = inject(NgbDateParserFormatter);

	hoveredDate: NgbDate | null = null;
	fromDate: NgbDate | null = this.calendar.getPrev(this.calendar.getToday(), 'd', 10);
	toDate: NgbDate | null = this.calendar.getToday()// this.calendar.getNext(this.calendar.getToday(), 'd', 10);

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
      this.getSummaryByParkingEvolution();
      // this.getSummaryByParking();
      this.getSummaryInOut()
    }
	}

	isHovered(date: NgbDate) {
		return (
			this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
		);
	}

	isInside(date: NgbDate) {
		return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
	}

	isRange(date: NgbDate) {
		return (
			date.equals(this.fromDate) ||
			(this.toDate && date.equals(this.toDate)) ||
			this.isInside(date) ||
			this.isHovered(date)
		);
	}

	validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
		const parsed = this.formatter.parse(input);
		return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
	}

  async getTicketsEvolutionByDate() {
    let currentDate = new Date()
    const response = this.tickesService.getTicketsEvolutionByDate(currentDate.toISOString(), this.idParking);
    const resp:any = await firstValueFrom(response);
    if(resp) {
      // this.detailTickest = resp.evolutionOutDate;
      this.dashboardSocket.changeCurrentDateTicket(resp.evolutionOutDate);
    }
  }
  setSummaryDetailData() {
    this.summaryDetailData = {
      totalTicket: this.detailTickest.length,
      totalAmount: this.detailTickest.reduce((a,b) => a + b.amount, 0)
    }

  }



}
