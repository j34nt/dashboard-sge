import { Component, NgZone, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ParkingService } from 'src/app/services/parking.service';
import { PaymentsService } from 'src/app/services/payments.service';
import { cilList, cilShieldAlt, cilPencil,cilDelete, cilCheck, cilX} from '@coreui/icons';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HexToDecPipe } from 'src/app/pipes/hex-to-dec.pipe';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss'],
  // imports:[HexToDecPipe]
})
export class PaymentMethodsComponent implements OnInit {
  paymentList:any[] = [];
  parkingsList:any[] = [];
  idParking:any;
  icons = {cilList, cilShieldAlt, cilPencil,cilDelete, cilCheck, cilX};
  formPayment:FormGroup;
  visiblePayment = false;
  saving = false;
  showToast = false;
  titleToast = '';
  colorToast = '';
  messageToast = '';
  positionToast:string='top-end';
  iconsList:any[] = [];
  iconName = 'check';
  options = [
    { value: '1', text: 'Opción 1', icon: "<i class='material-icons'>flag</i>" },
    { value: '2', text: 'Opción 2', icon: 'star' },
    // Agrega más opciones según sea necesario
  ];
  usersList:any[] = [];



  constructor(
    private parkingService: ParkingService,
    private paymentService: PaymentsService,
    private fb: FormBuilder,
    private activateddRoute: ActivatedRoute,
    private usersService:UserService,
    private ngZone: NgZone
  ){
    this.activateddRoute.params.subscribe(params => {
      console.log(params)
      const {id_parking} = params;
      if(id_parking) {
        this.idParking = id_parking;
        this.getallPaymmentsByParking(this.idParking);
      } else {
        //TODO
        // this.getallUsers();
      }
    });
  }

  ngOnInit() {
    this.getallParkings();
    this.createForm();
    this.getListIcons();
  }

  // async getUsersByParking() {
  //   const users = this.usersService.getUsersByParkingDe(this.idParking);
  //   this.usersList = await firstValueFrom(users);
  //   // console.log(this.usersList)
  // }
  // async getallUsers() {
  //   const users = this.usersService.getAllUsers();
  //   this.usersList = await firstValueFrom(users);
  //   // console.log(this.usersList)
  // }

  createForm() {
    this.formPayment = this.fb.group({
      id:new FormControl(''),
      description:new FormControl(''),
      second_rate:new FormControl(0),
      first_rate:new FormControl(0),
      first_tolerance:new FormControl(0),
      third_rate:new FormControl(0),
      third_tolerance:new FormControl(0),
      second_tolerance:new FormControl(0),
      second_time:new FormControl(0),
      first_time:new FormControl(0),
      icon:new FormControl(''),
      icon_temp:new FormControl(''),
      third_time:new FormControl(0),
      parking_id:new FormControl(''),
      enabled:new FormControl(true)
    })
  }

  async getallParkings() {
    const parkings = this.parkingService.getSadminListParkings();
    this.parkingsList = await firstValueFrom(parkings);
    // console.log(this.parkingsList)
  }
  async getallPaymmentsByParking(idParking:any) {
    const payments = this.paymentService.getSadminListPaymentsById(idParking);
    this.paymentList = await firstValueFrom(payments);
    // console.log(this.parkingsList)
  }
  async getListIcons() {
    this.paymentService.getIconsList().then((resp:any) => {
      this.iconsList = resp;
      console.log('icons ',this.iconsList);
    });
  }

  async toggleEditPayment(){
    this.visiblePayment = !this.visiblePayment;
    if(this.visiblePayment == true) {
      
      this.formPayment.patchValue({
        parking_id: this.idParking ? this.idParking : ''
      });
    }
    if(this.visiblePayment == false) {
      this.formPayment.reset();
    }

  }
  selectParking() {
    console.log('idParking selected ',this.idParking);
    if(this.idParking) {
      this.getallPaymmentsByParking(this.idParking);
      this.formPayment.patchValue({
        parking_id: this.idParking
      })
    }

  }

  editPayment(payment:any) {
    if(payment.icon) {
      const parseIcon =  +payment.icon;
      payment.icon_temp = '&#x' + parseIcon.toString(16);
      console.log(payment);

      const iconTest = this.iconsList.find(item => item.code == payment.icon_temp.toString());
      console.log(iconTest);
      if(iconTest) {
        this.iconName = iconTest;
      }

    } else {
      payment.icon_temp = '';
    }
    this.formPayment.setValue(payment);
    this.toggleEditPayment();
  }

  confirmDeletePayment(payment:any) {

  }

  toggleEditUser() {

  }

  handleEditPaymentChange(event:any) {
    console.log(event);
  }

  async savePayment() {
    console.log(this.formPayment.value);
    const updatePayment = this.paymentService.updatePayment(this.formPayment.value);
    await firstValueFrom(updatePayment).then(resp => {
      this.toggleEditPayment();
    }).catch(err => {
      this.showToast = true;
      this.titleToast = 'Error';
      this.colorToast = 'danger';
      this.messageToast = `Ocurrió un error al ingresar: ${err.message}`
    })
  }
  selectIcon() {
    this.ngZone.run(() => {
      this.iconName = this.formPayment.controls['icon_temp'].value;
      console.log(this.iconName);
      const iconToSave = parseInt(this.iconsList.find(item => item.name == this.iconName).code.substring(3), 16)
      console.log(iconToSave);
      this.formPayment.patchValue({
        icon: iconToSave
      });


    })
  }

}
