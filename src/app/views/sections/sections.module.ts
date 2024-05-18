import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import {ModalModule, ButtonModule, FormModule, GridModule, ToastModule, PaginationModule, CardModule} from '@coreui/angular';

import { UsersComponent } from './components/users/users.component';
import { PaymentMethodsComponent } from './components/payment-methods/payment-methods.component';
import { HexToDecPipe } from 'src/app/pipes/hex-to-dec.pipe';
import { ReportsComponent } from './components/reports/reports.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    UsersComponent,
    PaymentMethodsComponent,
    HexToDecPipe,
    ReportsComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    ModalModule,
    ButtonModule,
    FormModule,
    IconModule,
    GridModule,
    ToastModule,
    NgbDatepickerModule,
    PaginationModule,
    CardModule
  ],
  exports:[
    UsersComponent,
    PaymentMethodsComponent,
    ReportsComponent
  ],
  providers:[
    IconSetService
  ]
})
export class SectionsModule { }
