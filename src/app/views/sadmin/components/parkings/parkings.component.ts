import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import {ParkingService} from 'src/app/services/parking.service';
import { cilList, cilShieldAlt, cilPencil,cilDelete} from '@coreui/icons';

@Component({
  selector: 'app-parkings',
  templateUrl: './parkings.component.html',
  styleUrls: ['./parkings.component.scss']
})
export class ParkingsComponent {
  listParking:any[] = [];
  visible = false;
  visibleDelete = false;
  formParking: FormGroup;
  saving = false;
  parkingToDelete:any;
  icons = { cilList, cilShieldAlt, cilPencil,cilDelete};

  constructor(
    private parkingService: ParkingService,
    private fb: FormBuilder
  ) {
    this.getParkingsList();
    this.createForm();
  }

  createForm() {
    this.formParking = this.fb.group({
      id:new FormControl(''),
      address:new FormControl('', Validators.required),
      description:new FormControl('', Validators.required),
      lost_ticket:new FormControl(0, Validators.required),
    })
  }

  async getParkingsList(){
    const parkings = this.parkingService.getSadminListParkings();
    this.listParking = await firstValueFrom(parkings);

    // .then((resp:any) => {
    //   console.log(resp)
    //   if(resp && resp.ok == true) {
    //     console.log('paso')
    //   }
    // }).catch(err => {
    //   console.log('ocurrió un error',err);
      
    // })
  }

  async saveParking() {
    if(this.formParking.invalid) {
      console.log(this.formParking)
      return;
    } else {
      this.saving = true;
      if(this.formParking.value.id != null) {
        const updatePark = this.parkingService.updateParking(this.formParking.value);
        await firstValueFrom(updatePark).then(resp => {
          console.log(resp);
          this.getParkingsList();
          this.toggleLiveDemo();
          this.saving = false;
        }).catch(err => {
          console.log(err);
          this.saving = false;
  
        })

      } else {
        const newPark = this.parkingService.createParking(this.formParking.value);
        await firstValueFrom(newPark).then(resp => {
          console.log(resp);
          this.getParkingsList();
          this.toggleLiveDemo();
          this.saving = false;
        }).catch(err => {
          console.log(err);
          this.saving = false;
  
        })

      }
    }
  }

  toggleLiveDemo() {
    this.visible = !this.visible;
  }
  toggleDeleteModal() {
    this.visibleDelete = !this.visibleDelete;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }
  handleDeleteConfirmChange(event: any) {
    this.visibleDelete = event;
  }

  editParking(parking:any) {
    this.formParking.patchValue({
      id:parking.id,
      address:parking.address,
      description:parking.description,
      lost_ticket:parking.lost_ticket
    });
    this.toggleLiveDemo();
    
  }

  confirmDeleteParking(parking:any) {
    this.parkingToDelete = parking;
    this.handleDeleteConfirmChange(true);
  }
  async deleteParking() {
    const deletePark = this.parkingService.deleteParking(this.parkingToDelete);
        await firstValueFrom(deletePark).then(resp => {
          console.log(resp);
          this.getParkingsList();
          this.toggleDeleteModal();
          // this.saving = false;
        }).catch(err => {
          console.log(err);
          // this.saving = false;
  
        })

  }

}
