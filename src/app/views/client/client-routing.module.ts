import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from '../sections/components/users/users.component';
import { CDashboardComponent } from './components/c-dashboard/c-dashboard.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { PaymentMethodsComponent } from '../sections/components/payment-methods/payment-methods.component';
import { ReportsComponent } from '../sections/components/reports/reports.component';

const routes: Routes = [
  {
    path:'dashboard',
    component:DashboardComponent
  },
  {
    path:'users',
    component:UsersComponent
  },
  {
    path:'payments',
    component:PaymentMethodsComponent
  },
  {
    path:'reports',
    component:ReportsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
