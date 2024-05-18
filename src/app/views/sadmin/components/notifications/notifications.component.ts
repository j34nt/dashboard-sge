import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { ParkingService } from 'src/app/services/parking.service';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  visible = false;
  clientsSucces:any[] = [];
  clientsError:any[] = [];
  file:any = {}
  fileNotificationUrl:any = ''

  listParking:any[] = [
    {id:1, description: 'TEST1'},
    {id:2, description: 'TEST2'},
    {id:3, description: 'TEST3'},
    {id:4, description: 'TEST4'},
    {id:5, description: 'TEST5'},
  ];
  templateList:any[] = [
    {id:'SHIFT', description: 'Reporte Día'},
    {id:'INFO', description: 'Información'},
    // {id:3, description: 'Plantilla3'},
    // {id:4, description: 'Plantilla4'},
    // {id:5, description: 'Plantilla5'},
  ]
  formNotification:FormGroup;
  idParking:any;
  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private parkingService: ParkingService,
    private storage: Storage
  ) {}

  ngOnInit(){
    this.createForm();
    this.getParkingsList();

  }

  createForm() {
    this.formNotification = this.fb.group({
      title: new FormControl('', Validators.required),
      description:new FormControl('', Validators.required),
      detail:new FormControl('', Validators.required),
      idParking:new FormControl('', Validators.required),
      type:new FormControl('', Validators.required)
    })
  }
  async getParkingsList(){
    const parkings = this.parkingService.getSadminListParkings();
    this.listParking = await firstValueFrom(parkings);
  }

  async sendNotification() {
    if(this.formNotification.valid) {
      if(this.file && this.file.size > 0) {
        this.addFileData()
      } else {
        this.sendForm();
      }
      
    } else{
      console.log('Formulario no valido')
    }
  }

  async sendForm(image?:any) {
    const params = {
      title: this.formNotification.controls['title'].value,
      header: this.formNotification.controls['title'].value,
      description: this.formNotification.controls['description'].value,
      detail: this.formNotification.controls['detail'].value,
      idParking: this.formNotification.controls['idParking'].value,
      date: new Date(),
      image: image ? image : '',
      type:this.formNotification.controls['type'].value
    }
    const notification = this.notificationService.sendNotification(params);
    const resp = await firstValueFrom(notification);
    if(resp.ok) {
      this.formNotification.reset();
      this.visible = true;
      this.clientsSucces = resp.clients;
      this.clientsError = resp.clients_error;

    }
  }

  uploadImage(event:any) {
    const file = event.target.files[0];
    this.file = file;
  }
  addFileData() {
    const storageRef = ref(this.storage, 'notificationsFile/' + this.file.name);
    const uploadTask = uploadBytesResumable(storageRef, this.file);
    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes);
      console.log('Upload is ' + progress + '% done');
      
    },
    (error) => {
      console.log('Error saving file on storage');
      
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
        console.log('File available at ', downloadUrl);
        this.fileNotificationUrl = downloadUrl;
        this.sendForm(this.fileNotificationUrl);
        
      })
    })
    
  }

  handleLiveNotificationChange(event:any) {
    console.log(event)
  }
  toggleLiveNotification() {
    this.visible = !this.visible;
  }

}
