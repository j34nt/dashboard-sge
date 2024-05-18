import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { CDashboardComponent } from './components/c-dashboard/c-dashboard.component';
import {CardModule,FormModule,GridModule, ButtonModule, ButtonGroupModule, ProgressModule} from '@coreui/angular'
import { ReactiveFormsModule } from '@angular/forms';
import { ChartjsModule } from '@coreui/angular-chartjs';
import { DashboardModule } from '../dashboard/dashboard.module';


@NgModule({
  declarations: [
    CDashboardComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    CardModule,
    GridModule,
    FormModule,
    DashboardModule,
    ReactiveFormsModule,
    ButtonGroupModule,
    ButtonModule,
    ChartjsModule,
    ProgressModule
  ]
})
export class ClientModule { }
