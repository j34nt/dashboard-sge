import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SadminRoutingModule } from './sadmin-routing.module';
import { ParkingsComponent } from './components/parkings/parkings.component';

import {ModalModule, ButtonModule, FormModule, GridModule, ListGroupModule} from '@coreui/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { IconModule } from '@coreui/icons-angular';
import { NotificationsComponent } from './components/notifications/notifications.component';
import {SectionsModule} from 'src/app/views/sections/sections.module';


@NgModule({
  declarations: [
    ParkingsComponent,
    NotificationsComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SadminRoutingModule,
    ModalModule,
    ButtonModule,
    FormModule,
    IconModule,
    GridModule,
    ListGroupModule,
    SectionsModule
  ]
})
export class SadminModule { }
