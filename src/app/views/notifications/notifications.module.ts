import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AlertModule } from 'ngx-bootstrap/alert';
import { AlertsComponent } from './alerts.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ModalsComponent } from './modals.component';
import { NotificationsRoutingModule } from './notifications-routing.module';

@NgModule({
  imports: [
    CommonModule,
    NotificationsRoutingModule,
    AlertModule.forRoot(),
    ModalModule.forRoot()
  ],
  declarations: [
    AlertsComponent,
    ModalsComponent
  ]
})
export class NotificationsModule { }
