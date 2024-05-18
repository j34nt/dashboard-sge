import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ParkingsComponent} from './components/parkings/parkings.component';
import { UsersComponent } from '../sections/components/users/users.component';
import { PaymentMethodsComponent } from '../sections/components/payment-methods/payment-methods.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ReportsComponent } from '../sections/components/reports/reports.component';

const routes: Routes = [
  {
    path:'parkings',
    component:ParkingsComponent
  },
  {
    path:'notifications',
    component:NotificationsComponent
  },
  {
    path:'users',
    component:UsersComponent
  },
  {
    path:'reports',
    component:ReportsComponent
  },
  {
    path:'payment_methods',
    component:PaymentMethodsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SadminRoutingModule { }
