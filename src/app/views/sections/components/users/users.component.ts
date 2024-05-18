import { Component, ViewChild } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { cilList, cilShieldAlt, cilPencil,cilDelete} from '@coreui/icons';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { ParkingService } from 'src/app/services/parking.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {

  idParking:string;
  usersList:any[] = [];
  parkingsList:any[] = [];
  visibleEdit = false;
  visibleDelete = false;
  saving = false;
  icons = {cilList, cilShieldAlt, cilPencil,cilDelete}
  userToDelete:any;
  formUser: FormGroup;
  listRoles:any[] = [
    {
      value:'user-scan',
      name:'Usuario Escaner'
    },
    {
      value:'user-cupon',
      name:'Usuario Cupon'
    },
    {
      value:'client',
      name:'Cliente'
    },
    {
      value:'admin',
      name:'Administrador'
    },
  ];

  @ViewChild('userForm', {static:false}) userForm:NgForm
  constructor(
    private usersService:UserService,
    private parkingService:ParkingService,
    private fb: FormBuilder,
    private activateddRoute: ActivatedRoute
  ){
    this.activateddRoute.params.subscribe(params => {
      console.log(params)
      const {id_parking} = params;
      if(id_parking) {
        this.idParking = id_parking;
        this.getUsersByParking();
      } else {

        this.getallUsers();
      }
    });
    this.createForm();
    this.getallParkings();
  }

  async getUsersByParking() {
    const users = this.usersService.getUsersByParkingDe(this.idParking);
    this.usersList = await firstValueFrom(users);
    // console.log(this.usersList)
  }
  async getallUsers() {
    const users = this.usersService.getAllUsers();
    this.usersList = await firstValueFrom(users);
    // console.log(this.usersList)
  }
  async getallParkings() {
    const parkings = this.parkingService.getSadminListParkings();
    this.parkingsList = await firstValueFrom(parkings);
    // console.log(this.parkingsList)
  }

  createForm() {
    this.formUser = this.fb.group({
      uid:new FormControl(''),
      pass:new FormControl(),
      name:new FormControl(''),
      last_name:new FormControl(''),
      display_name:new FormControl(''),
      email:new FormControl(''),
      phone:new FormControl(''),
      role:new FormControl(''),
      parking_id:new FormControl({value:this.idParking, disabled:this.idParking?.length > 0 ? true : false}),
      notification_token:new FormControl('10'),
      module:new FormControl(''),
      enabled:new FormControl(true),
    })
  }

  editUser(user:any) {
    // console.log(user)
    if(user != null) {
      this.formUser.patchValue({
        uid:user.uid,
        name:user.name,
        last_name:user.last_name || '',
        display_name:user.display_name || '',
        email:user.email,
        phone:user.phone || '',
        role:user.role,
        module:user.module || '',
        enabled:user.enabled || true,
        notification_token:user.notification_token || '',
        parking_id:this.idParking ? this.idParking : user.parking_id._id,
      });
      this.toggleEditUser();
    }

  }
  confirmDeleteUser(user:any) {
    this.userToDelete = user;
    this.toggleDeleteModal();

  }

  deleteUser() {
    const {enabled, ...obj} = this.userToDelete;
    const userToDelete = {
      enabled :false,
      ...obj
    }
    this.setUser(userToDelete);
  }

  toggleDeleteModal() {
    this.visibleDelete = !this.visibleDelete;
    if(this.visibleDelete == false) {
      this.userToDelete = null;
    }
  }
  toggleEditUser() {
    this.visibleEdit = !this.visibleEdit;
    if(this.visibleEdit == false) {
      this.formUser.reset();
    } else {
      if(this.idParking.length > 0) {
        this.formUser.patchValue({
          parking_id:this.idParking
        })
      }
    }
  }
  handleEditUserChange(event: any) {
    this.visibleEdit = event;
  }
  handleDeleteConfirmChange(event: any) {
    this.visibleDelete = event;
  }

  async saveUser() {
    console.log(this.formUser.value);
    if(this.formUser.valid) {
      this.setUser(this.formUser.value)
    } else {
      console.log('form invalid', this.formUser);
    }

  }

  async setUser(user:any) {
    const updateUser = this.usersService.updateUser(user);
      await firstValueFrom(updateUser).then(resp => {
        // console.log(resp);
        this.toggleEditUser();
        this.formUser.reset();
      }).catch(err => {
        console.log('Error guardando usuario');
      })
  }

}
