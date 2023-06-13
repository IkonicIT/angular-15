import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatusRoutingModule } from './status-routing.module';
import { StatusComponent } from './status.component';
import { StatusManagementComponent } from './status-management/status-management.component';
import { AddStatusComponent } from './add-status/add-status.component';
import { EditStatusComponent } from './edit-status/edit-status.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgPipesModule } from 'ngx-pipes';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    StatusRoutingModule,
    NgxPaginationModule,
    TooltipModule.forRoot(),
    NgPipesModule,
    AlertModule.forRoot()
  ],
  declarations: [StatusComponent, StatusManagementComponent, AddStatusComponent, EditStatusComponent]
})
export class StatusModule { }
